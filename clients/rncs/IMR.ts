import { RNCSClientWrapper } from '.';
import { IBeneficiaire, IDirigeant } from '../../models/dirigeants';
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
  beneficiaires: {
    beneficiaire: IRNCSBeneficiaireResponse | IRNCSBeneficiaireResponse[];
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

export interface IRNCSBeneficiaireResponse {
  type_entite: string; //'BE_SOC';
  nom_naissance: string; //'Penchienati';
  prenoms: string; //'Veronique Bianca';
  date_naissance: string; //'01/1967';
  nationalite: string; //'Française';
  detention_pouvoir_decision_ag: boolean; //false;
  deten_pvr_nom_membr_cons_admin: boolean; //false;
  detent_autres_moyens_controle: boolean; //false;
  benef_reprst_legal: boolean; //true;
  rep_legal_placmt_ss_gest_deleg: boolean; //false;
  date_greffe: string; //20210416;
  date_integration: string; //20210416;
}

interface IZipFileAsBuffer {
  file: string;
  buffer: Buffer;
}

export const fetchRNCSIMR = async (siren: Siren) => {
  const IMRBuffer = await fetchIMRAsBuffer(siren);
  const xmlResponse = await unzipTwiceIMR(IMRBuffer, siren);
  return mapToDomainObject(xmlResponse, siren);
};

const mapToDomainObject = (
  xmlResponse: string,
  siren: Siren
): { dirigeants: IDirigeant[]; beneficiaires: IBeneficiaire[] } => {
  const { dirigeants, beneficiaires } = extractIMRFromXml(xmlResponse, siren);

  return { dirigeants, beneficiaires };
};

const fetchIMRAsBuffer = async (siren: Siren) => {
  const response = await RNCSClientWrapper(routes.rncs.api.imr.get + siren, {
    responseType: 'arraybuffer',
  });
  const arrayBuffer = await response.data;
  return Buffer.from(new Uint8Array(arrayBuffer));
};

/**
 * Unzip twice and returns XML
 * @param IMRBuffer
 * @param siren
 * @returns
 */
const unzipTwiceIMR = async (
  IMRBuffer: Buffer,
  siren: Siren
): Promise<string> => {
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
  return extractedXMLBuffer[0].buffer.toString();
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
