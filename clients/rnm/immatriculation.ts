import { IImmatriculationRNM } from '../../models/immatriculation';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { fetchWithTimeout } from '../../utils/network/fetch-with-timeout';
import { HttpNotFound } from '../exceptions';
import routes from '../routes';

export interface IApiRNMResponse {
  ent_id_num_gestion: string | null;
  ent_id_siren: string | null;
  ent_id_origine: string | null;
  ent_adr_numero_voie: string | null;
  ent_adr_indice_repetition: string | null;
  ent_adr_type_voie: string | null;
  ent_adr_adresse: string | null;
  ent_adr_adresse_complement: string | null;
  ent_adr_code_postal: string | null;
  ent_adr_commune: string | null;
  ent_adr_commune_cog: string | null;
  ent_act_code_nafa_principal: string | null;
  ent_act_date_immat_rm: string | null;
  ent_act_date_radiation: string | null;
  ent_act_date_debut_activite: string | null;
  ent_act_date_cessation_activite: string | null;
  ent_act_date_cloture_liquidation: string | null;
  ent_act_date_transfert_patrimoine: string | null;
  ent_act_date_dissolution: string | null;
  ent_act_modalite_exercice: string | null;
  ent_act_non_sedentaire: string | null;
  ent_act_activite_artisanales_declarees: string | null;
  ent_act_denomination_sociale: string | null;
  ent_act_forme_juridique: string | null;
  ent_eff_salarie: string | null;
  ent_eff_apprenti: string | null;
  ent_jug_procedures: string | null;
  gest_maj_fichier: string | null;
  gest_date_maj: string | null;
  dir_qa_qualification: string | null;
  dir_id_nom_naissance: string | null;
  dir_id_nom_usage: string | null;
  dir_id_prenom_1: string | null;
  dir_id_prenom_2: string | null;
  dir_id_prenom_3: string | null;
  dir_id_pseudonyme: string | null;
  dir_id_date_naissance: string | null;
  dir_id_lieu_naissance: string | null;
  eirl_init_nom_registre: string | null;
  eirl_denomination: string | null;
  eirl_objet_dap: string | null;
  eirl_date_depot: string | null;
  gest_nar_4: string | null;
  gest_nar_20: string | null;
  gest_libelle_code_nafa: string | null;
  gest_dept: string | null;
  gest_reg: string | null;
  gest_emetteur: string | null;
  gest_categorie: string | null;
  gest_label_forme_juridique: string | null;
  epci: string | null;
  ent_act_code_apen: string | null;
}

export const fetchRnmImmatriculation = async (
  siren: Siren
): Promise<IImmatriculationRNM> => {
  const response = await fetchWithTimeout(routes.rnm + siren + '?format=json');
  if (response.status === 404) {
    throw new HttpNotFound(404, `Siren ${siren} not found in RNM`);
  }
  return mapToDomainObject(siren, await response.json());
};

const mapToDomainObject = (
  siren: Siren,
  apiRnmResponse: IApiRNMResponse
): IImmatriculationRNM => {
  return {
    siren,
    immatriculation: {
      codeAPRM: apiRnmResponse.ent_act_code_nafa_principal,
      activitésArtisanalesDéclarées:
        apiRnmResponse.ent_act_activite_artisanales_declarees,
      dirigeantQualification: apiRnmResponse.dir_qa_qualification,
    },
    downloadlink: routes.rnm + siren,
  };
};
