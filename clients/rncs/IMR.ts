import { RNCSClientWrapper } from '.';
import { IDirigeant } from '../../models/dirigeants';
import { Siren } from '../../utils/helpers/siren-and-siret';
import routes from '../routes';
import yauzl from 'yauzl';
import { HttpNotFound } from '../exceptions';
import { extractIMRFromXml } from './IMRParser';
import { logWarningInSentry } from '../../utils/sentry';

export interface IRNCSResponse {
  fichier: {
    // un dossier par greffe, tous les représentants ont été déplacés par l'inpi dans un seul dossier
    dossier: IRNCSResponseDossier | IRNCSResponseDossier[];
  };
}

export interface IRNCSResponseDossier {
  representants: {
    representant: IRNCSRepresentantResponse | IRNCSRepresentantResponse[];
  };
}

export interface IRNCSRepresentantResponse {
  prenoms: string;
  nom_patronymique: string;
  lieu_naiss: string;
  code_pays_naiss: string;
  dat_naiss: string;
  qualites: { qualite: string | string[] };
  form_jur: string;
  siren: string;
  denomination: string;
  type: string;
}

interface IZipFileAsBuffer {
  file: string;
  buffer: Buffer;
}

export const fetchRNCSIMR = async (siren: Siren) => {
  const IMRBuffer = await fetchIMRAsBuffer(siren);
  const unzippedIMR = await unZipFromBuffer(IMRBuffer);

  if (unzippedIMR.length > 2) {
    logWarningInSentry('More than 2 files returned in IMR zip', {
      siren,
      details: unzippedIMR.join(', '),
    });
  }

  // we assume first archive only contains one zip file
  const zippedIMRFile = unzippedIMR.find(
    (extractedFile) => extractedFile.file.indexOf('.zip') > -1
  );

  if (!zippedIMRFile) {
    throw new HttpNotFound(404, 'No IMR found');
  }

  const extractedXMLBuffer = await unZipFromBuffer(zippedIMRFile.buffer);
  const xmlResponse = extractedXMLBuffer[0].buffer.toString();

  return mapToDomainObject(xmlResponse, siren);
};

const mapToDomainObject = (xmlResponse: string, siren: Siren): IDirigeant[] => {
  const dirigeants = extractIMRFromXml(xmlResponse, siren);

  return dirigeants;
};

const fetchIMRAsBuffer = async (siren: Siren) => {
  const response = await RNCSClientWrapper(routes.rncs.api.imr.get + siren, {
    responseType: 'arraybuffer',
  });
  const arrayBuffer = await response.data;
  return Buffer.from(new Uint8Array(arrayBuffer));
};

const unZipFromBuffer = (buffer: Buffer): Promise<IZipFileAsBuffer[]> => {
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(
      buffer,
      { autoClose: true, lazyEntries: true },
      function (err, zipfile) {
        const extractedFiles: IZipFileAsBuffer[] = [];

        if (err) {
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
                  const chunks: any[] = [];

                  if (err) throw err;
                  if (!readStream) throw new Error('ReadStream is undefined');

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
