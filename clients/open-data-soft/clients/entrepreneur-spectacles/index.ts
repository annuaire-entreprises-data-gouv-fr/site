import routes from '#clients/routes';
import { IEntrepreneurSpectaclesCertification } from '#models/certifications/entrepreneur-spectacles';
import { Siren } from '#utils/helpers';
import odsClient from '../..';

type ISpectaclesVivantsRecord = {
  numero_recepisse: string; //"PLATESV-R-2021-013704"
  categorie: number; //2
  date_depot_dossier: string; //"2021-11-30"
  date_debut_validite: string; //"12/01/2022"
  statut_recepisse: string; //"Valide"
  raison_sociale: string; //"MANAKIN PRODUCTION"
  type_declaration: string; //"Renouvellement"
  type_declarant: string; //"Personne morale"
  code_postal: string; //"75018"
  siren_siret: number; //84201905100015
  code_naf: string; //"90.01Z - Arts du spectacle vivant"
  nom_lieu: string;
  code_postal_lieu: string; //"75018"
  geoloc_cp: string[];
  departement: string; //"Paris"
  region: string; //"Île-de-France"
};

export const clientEntrepreneurSpectacles = async (
  siren: Siren
): Promise<IEntrepreneurSpectaclesCertification> => {
  // siret column is an int. Does not support string search query so fallback on either exactmatch or int range

  const url = routes.certifications.entrepreneurSpectacles.ods.search;
  const metaDataUrl = routes.certifications.entrepreneurSpectacles.ods.metadata;

  const response = await odsClient(
    {
      url,
      config: {
        params: {
          q: `#startswith(siren_siret,"${siren}")`,
          sort: 'date_depot_dossier',
        },
      },
    },
    metaDataUrl
  );

  return {
    licences: response.records.map((record: ISpectaclesVivantsRecord) => ({
      categorie: record.categorie,
      numeroRecepisse: record.numero_recepisse || '',
      nomLieu: record.nom_lieu || '',
      statut: record.statut_recepisse || '',
      dateValidite:
        record.date_debut_validite ||
        '',
      dateDepot:
        record.date_depot_dossier || '',
      type: record.type_declaration || '',
    })),
    lastModified: response.lastModified,
  };
};
