import { RNCSClientWrapper } from '.';
import { IEtatCivil, IPersonneMorale } from '../../models/dirigeants';
import { Siren } from '../../utils/helpers/siren-and-siret';
import routes from '../routes';
import yauzl from 'yauzl';
import fs from 'fs';
import xml2js from 'xml2js';
import { HttpNotFound } from '../exceptions';
import { v4 as uuidv4 } from 'uuid';
import rimraf from 'rimraf';

interface IApiRNCSResponse {
  dirigeants: any;
  beneficiaires: any;
}

export const fetchRNCSDirigeants = async (siren: Siren) => {
  const uuid = uuidv4();
  const filePath = `/tmp/${uuid}.zip`;
  const fileFolder = `/tmp/${uuid}/`;

  try {
    const zipOfZipFile = await downloadIMRZip(siren, filePath);

    await createFolderIfDoesNotExists(fileFolder);
    const extractedZippedFilesPath = await unzip(zipOfZipFile, fileFolder);

    const zippedIMRFile = extractedZippedFilesPath.find(
      (extractedFile) => extractedFile.indexOf('.zip') > -1
    );

    if (!zippedIMRFile) {
      throw new HttpNotFound(404, 'No IMR found');
    }

    const IMRFileFolder = `${fileFolder}extract/`;
    await createFolderIfDoesNotExists(IMRFileFolder);
    const extractedXMLPath = await unzip(zippedIMRFile, IMRFileFolder);

    const response = await openRNCSXml(extractedXMLPath[0]);

    return mapToDomainObject(response);
  } finally {
    await fs.unlink(filePath, () => {});
    await rimraf(fileFolder, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
};

const mapToDomainObject = (
  apiRNCSResponse: IApiRNCSResponse
): (IEtatCivil | IPersonneMorale)[] => {
  const r = apiRNCSResponse.fichier.dossier.find(
    (response) => response.representants !== undefined
  );

  return r.representants[0].representant.map(extractDirigeants);
};

const extractDirigeants = (dirigeant: any) => {
  const {
    prenoms,
    nom_patronymique,
    lieu_naiss,
    code_pays_naiss,
    dat_naiss,
    qualites,
    form_jur,
    siren,
    denomination,
    type,
  } = dirigeant;
  try {
    if (type[0] === 'P.Physique') {
      return {
        prenom: prenoms[0].split(' ')[0],
        nom: nom_patronymique[0],
        role: qualites[0].qualite[0],
        lieuNaissance: lieu_naiss[0] + ', ' + code_pays_naiss[0],
        dateNaissance: dat_naiss[0].slice(0, 4),
      };
    } else {
      return {
        siren: siren[0],
        denomination: denomination[0],
        role: qualites[0].qualite[0],
        natureJuridique: form_jur[0],
      };
    }
  } catch (e) {
    console.log(dirigeant);
    console.log(e);
  }
};

const downloadIMRZip = async (
  siren: Siren,
  filePath: string
): Promise<string> => {
  const response = await RNCSClientWrapper(routes.rncs.api.imr.get + siren, {});
  const readableStream = response.body;

  return new Promise((resolve, reject) => {
    try {
      if (!readableStream) {
        throw new HttpNotFound(404, 'No IMR found');
      }

      const writer = fs.createWriteStream(filePath);
      readableStream.on('readable', () => {
        let chunk;
        while (null !== (chunk = readableStream.read())) {
          writer.write(chunk);
        }
      });
      readableStream.on('error', () => {
        console.log('error');
      });
      readableStream.on('end', () => {
        resolve(filePath);
      });
    } catch (e) {
      console.log('reject download IMR' + e);
      reject(e);
    }
  });
};

const openRNCSXml = (path: string) => {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({ explicitArray: true });
    fs.readFile(
      path,
      {
        encoding: 'utf8',
        flag: 'r',
      },
      function (err, data) {
        if (err) reject(err);
        parser.parseString(data, function (err2, result) {
          if (err2) {
            reject(err2);
          }
          resolve(result);
        });
      }
    );
  });
};

const unzip = (
  zipFilePath: string,
  extractionFolder: string
): Promise<string[]> => {
  const extractedFiles: Promise<string>[] = [];

  return new Promise((resolve, reject) => {
    try {
      yauzl.open(zipFilePath, { lazyEntries: true }, function (err, zipfile) {
        if (err) {
          console.log('C’est la cacata' + err.message);
          reject(err.message);
        } else if (zipfile === undefined) {
          reject('Could not find zipfile:' + zipFilePath);
        } else {
          zipfile.readEntry();
          zipfile.on('entry', function (entry) {
            if (/\/$/.test(entry.fileName)) {
              // Directory file names end with '/'.
              // Note that entires for directories themselves are optional.
              // An entry's fileName implicitly requires its parent directories to exist.
              zipfile.readEntry();
            } else {
              try {
                const extractedFilePath = `${extractionFolder}${entry.fileName}`;
                extractedFiles.push(extractedFilePath);
                let writer = fs.createWriteStream(extractedFilePath);
                // file entry
                zipfile.openReadStream(entry, function (err, readStream) {
                  if (err) throw err;
                  readStream.on('end', function () {
                    zipfile.readEntry();
                  });
                  readStream.on('readable', () => {
                    let chunk;
                    while (null !== (chunk = readStream.read())) {
                      writer.write(chunk);
                    }
                  });
                });
              } catch (e) {
                console.log('zip extraction failed' + e);

                reject(e);
              }
            }
            zipfile.on('close', function () {
              resolve(extractedFiles);
            });
          });
        }
      });
    } catch (e) {
      console.log('Something failed' + e);
      reject(e);
    }
  });
};

const createFolderIfDoesNotExists = async (folderPath: string) => {
  await fs.access(folderPath, async (err) => {
    if (err) {
      await fs.mkdir(folderPath, () => {});
    }
  });
};
