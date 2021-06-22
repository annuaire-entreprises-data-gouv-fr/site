import { RNCSClientWrapper } from '.';
import {
  IDirigeant,
  IEtatCivil,
  IPersonneMorale,
} from '../../models/dirigeants';
import { Siren } from '../../utils/helpers/siren-and-siret';
import routes from '../routes';
import yauzl from 'yauzl';
import { HttpNotFound } from '../exceptions';
import parser from 'fast-xml-parser';

interface IApiRNCSResponse {
  dirigeants: any;
  beneficiaires: any;
}

export const fetchRNCSDirigeants = async (siren: Siren) => {
  const imrBuffer = await fetchIMRAsBuffer(siren);
  const res = await unZipFromBuffer(imrBuffer);

  // we assume first archive only contains one zip file
  const zippedIMRFile = res.find(
    (extractedFile) => extractedFile.file.indexOf('.zip') > -1
  );

  if (!zippedIMRFile) {
    throw new HttpNotFound(404, 'No IMR found');
  }

  const extractedXMLBuffer = await unZipFromBuffer(zippedIMRFile.buffer);
  const xmlString = await extractedXMLBuffer[0].buffer.toString();
  const response = await openRNCSXml(xmlString);

  return mapToDomainObject(response);
};

const mapToDomainObject = (
  apiRNCSResponse: IApiRNCSResponse
): { dirigeants: IDirigeant[] } => {
  let dossier;
  if (Array.isArray(apiRNCSResponse.fichier.dossier)) {
    dossier = apiRNCSResponse.fichier.dossier.find(
      (response) => response.representants !== undefined
    );
  } else {
    dossier = apiRNCSResponse.fichier.dossier;
  }
  const representant = dossier.representants.representant;
  const isRepresentantAnArray = Array.isArray(representant);

  const dirigeants = (
    isRepresentantAnArray ? representant : [representant]
  ).map(extractDirigeants);

  return { dirigeants };
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
    const qualite = qualites.qualite;
    const roles = Array.isArray(qualite) ? qualite.join(', ') : qualite;
    if (type === 'P.Physique') {
      return {
        prenom: prenoms.split(' ')[0],
        nom: nom_patronymique,
        role: roles,
        lieuNaissance: lieu_naiss + ', ' + code_pays_naiss,
        dateNaissance: dat_naiss.toString().slice(0, 4),
      };
    } else {
      return {
        siren: siren,
        denomination: denomination,
        role: roles,
        natureJuridique: form_jur,
      };
    }
  } catch (e) {
    console.log(dirigeant);
    console.log(e);
  }
};

const fetchIMRAsBuffer = async (siren: Siren) => {
  const response = await RNCSClientWrapper(routes.rncs.api.imr.get + siren, {});
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(new Uint8Array(arrayBuffer));
};

interface IZipFileAsBuffer {
  file: string;
  buffer: Buffer;
}

const unZipFromBuffer = (buffer: Buffer): Promise<IZipFileAsBuffer[]> => {
  const extractedFiles: IZipFileAsBuffer[] = [];

  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(
      buffer,
      { autoClose: true, lazyEntries: true },
      function (err, zipfile) {
        if (err) {
          console.log('C’est la cacata' + err.message);
          reject(err.message);
        } else if (zipfile === undefined) {
          reject('Could not find zipfile');
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
                // file entry
                zipfile.openReadStream(entry, function (err, readStream) {
                  const chunks = [];
                  if (err) throw err;
                  readStream.on('data', (chunk) => {
                    chunks.push(chunk);
                  });
                  readStream.on('end', function () {
                    extractedFiles.push({
                      file: entry.fileName,
                      buffer: Buffer.concat(chunks),
                    });
                    zipfile.readEntry();
                  });
                });
              } catch (e) {
                console.log('zip extraction failed' + e);

                reject(e);
              }
            }
            zipfile.on('end', function () {
              resolve(extractedFiles);
            });
          });
        }
      }
    );
  });
};

const openRNCSXml = (xmlString: string) => {
  const tObj = parser.getTraversalObj(xmlString, { arrayMode: false });
  return parser.convertToJson(tObj, { arrayMode: false });
};
