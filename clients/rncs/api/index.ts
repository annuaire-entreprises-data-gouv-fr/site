import { IImmatriculationRNCSCore } from '../../../models/immatriculation/rncs';
import { Siren } from '../../../utils/helpers/siren-and-siret';
import routes from '../../routes';
import { rncsApiGet } from './api-client';
import { extractIMRFromXml } from './IMR-parser';
import { unzipTwiceIMR } from './unzipper';

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

export const fetchRNCSImmatriculationFromAPI = async (siren: Siren) => {
  const response = await rncsApiGet(routes.rncs.api.imr.get + siren, {
    responseType: 'arraybuffer',
  });
  const data = await response.data;
  const IMRBuffer = Buffer.from(new Uint8Array(data));
  const xmlResponse = await unzipTwiceIMR(IMRBuffer, siren);
  return mapToDomainObject(xmlResponse, siren);
};

const mapToDomainObject = (
  xmlResponse: string,
  siren: Siren
): IImmatriculationRNCSCore => {
  const { dirigeants, beneficiaires, identite } = extractIMRFromXml(
    xmlResponse,
    siren
  );

  return {
    dirigeants,
    beneficiaires,
    identite,
    metadata: {
      isFallback: false,
    },
  };
};
