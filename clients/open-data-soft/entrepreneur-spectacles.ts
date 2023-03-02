import routes from '#clients/routes';
import { IEntrepreneurSpectaclesCertification } from '#models/certifications/entrepreneur-spectacles';
import { Siren } from '#utils/helpers';
import odsClient from '.';

interface ISpectaclesVivantsRecord {
  geoloc_cp: string[];
  raison_sociale_personne_morale_ou_nom_personne_physique: string; //"MANAKIN PRODUCTION"
  numero_de_recepisse: string; //"PLATESV-R-2021-013704"
  categorie: string; //2
  date_de_depot_de_la_declaration_inscrite_sur_le_recepisse: string; //"2021-11-30"
  siren_personne_physique_siret_personne_morale: number; //84201905100015
  type: string; //"Renouvellement"
  departement: string; //"Paris"
  region: string; //"Île-de-France"
  date_de_validite_du_recepisse_sauf_opposition_de_l_administration: string; //"12/01/2022"
  type_de_declarant: string; //"Personne morale"
  code_postal_de_l_etablissement_principal_personne_morale_ou_de_la_personne_physique: string; //"75018"
  code_naf_ape: string; //"90.01Z - Arts du spectacle vivant"
  statut_du_recepisse: string; //"Valide"
}

const clientEntrepreneurSpectacles = async (
  siren: Siren
): Promise<IEntrepreneurSpectaclesCertification> => {
  // siret column is an int. Does not support string search query so fallback on either exactmatch or int range
  const q = `siren_personne_physique_siret_personne_morale=${siren} OR (siren_personne_physique_siret_personne_morale > ${siren}00000 AND siren_personne_physique_siret_personne_morale < ${siren}99999)`;
  const searchUrl = `${routes.certifications.entrepreneurSpectacles.ods.search}&q=${q}&sort=date_de_depot_de_la_declaration_inscrite_sur_le_recepisse`;
  const metaDataUrl = routes.certifications.entrepreneurSpectacles.ods.metadata;

  const response = await odsClient({ url: searchUrl }, metaDataUrl);

  return {
    licences: response.records.map((record: ISpectaclesVivantsRecord) => ({
      numeroRecepisse: record.numero_de_recepisse || '',
      statut: record.statut_du_recepisse || '',
      dateValidite:
        record.date_de_validite_du_recepisse_sauf_opposition_de_l_administration ||
        '',
      dateDepot:
        record.date_de_depot_de_la_declaration_inscrite_sur_le_recepisse || '',
      type: record.type || '',
    })),
    lastModified: response.lastModified,
  };
};

export { clientEntrepreneurSpectacles };
