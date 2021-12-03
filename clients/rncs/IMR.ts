import { RNCSClientWrapper } from '.';
import { IBeneficiaire, IDirigeant, IIdentite } from '../../models/dirigeants';
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
  '@_code_greffe': string; //'7501',
  '@_num_gestion': string; // '2020B02214',
  '@_siren': string; // '880878145',
  representants: {
    representant: IRNCSRepresentantResponse | IRNCSRepresentantResponse[];
  };
  beneficiaires: {
    beneficiaire: IRNCSBeneficiaireResponse | IRNCSBeneficiaireResponse[];
  };
  identite: IRNCSIdentiteResponse;
}

export interface IRNCSRepresentantResponse {
  prenoms: string;
  nom_patronymique: string;
  nom_usage: string;
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
  nom_naissance: string; //'XXX';
  prenoms: string; //'YYY ZZZ';
  date_naissance: string; //'MM/YYYY';
  nationalite: string; //'Française';
  detention_pouvoir_decision_ag: boolean; //false;
  deten_pvr_nom_membr_cons_admin: boolean; //false;
  detent_autres_moyens_controle: boolean; //false;
  benef_reprst_legal: boolean; //true;
  rep_legal_placmt_ss_gest_deleg: boolean; //false;
  date_greffe: string; //20210416;
  date_integration: string; //20210416;
}

export interface IRNCSIdentiteResponse {
  type_inscrip: string; // 'P';
  libelle_evt: string; // 'Création';
  date_greffe: number; // 20200123;
  dat_immat: number; // 20200123;
  dat_1ere_immat: string; // '23/01/2020';
  dat_rad: string;
  dat_cessat_activite: string;
  sans_activ: string; // 'Non';
  date_debut_activ: string; // '23/01/2020';
  identite_PP: {
    nom_patronymique: string;
    nom_usage: string;
    prenom: string;
    dat_naiss: string;
    lieu_naiss: string;
    pays_naiss: string;
    nationalite: string;
    adr_siege_1: string;
    adr_siege_cp: number;
    adr_siege_ville: string;
    adr_siege_code_commune: number;
    adr_siege_pays: string;
    activ_forain_indic: string;
    eirl_indic: string;
    eirl_dap_indic: string;
  };
  identite_PM: {
    denomination: string; //'Ganymède',
    sigle: string;
    form_jur: string; //'Société par actions simplifiée',
    assoc_unique: string; //'Oui',
    activ_princip: string; //"La prestation de services informatiques , le conseil en informatique et services annexes , l'animation de formations informatiques , la création, la fourniture de tous supports de formation , la création et la commercialisation d'applications mobiles ou Web",
    type_cap: string; //'F',
    montant_cap: string; //1000,
    devise_cap: string; //'EUR',
    dat_cloture_exer: string; //'31 décembre',
    ess_indic: string; //'Non',
    duree_pm: string; //99
  };
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
): {
  dirigeants: IDirigeant[];
  beneficiaires: IBeneficiaire[];
  identite: IIdentite;
} => {
  const { dirigeants, beneficiaires, identite } = extractIMRFromXml(
    xmlResponse,
    siren
  );

  return { dirigeants, beneficiaires, identite };
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
              } catch (e: any) {
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
