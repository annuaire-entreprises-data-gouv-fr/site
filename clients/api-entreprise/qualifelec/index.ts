import routes from '#clients/routes';
import { IQualifelec } from '#models/espace-agent/certificats/qualifelec';
import { Siret } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseQualifelec = IAPIEntrepriseResponse<
  Array<{
    data: {
      document_url: string; //"https://github.com/etalab/siade_staging_data/blob/develop/payloads/api_entreprise_v3_qualifelec_certificats/exemple-certificat-qualifelec-bac-a-sable.jpg",
      numero: number; // 5430,
      rge: boolean; // true,
      date_debut: string; // "2019-01-01",
      date_fin: string; // "2021-12-31",
      qualification: {
        label: string; // "Installations Électriques Logement Commerce Petit Tertiaire - LCPT",
        date_debut: string; // "2019-01-01",
        date_fin: string; // "2024-12-31",
        indices: Array<{
          code: string; // "IRVE1",
          label: string; // "IRVE – indice 1 (station de recharge – puissance maximale appelable inférieure ou égale à 36 kVA)"
        }>;
        mentions: Array<{
          code: string; // "PRGE",
          label: string; // "Probatoire Reconnu Garant de l’Environnement"
        }>;
        domaines: Array<{
          code: string; // "SU",
          label: string; // "Sûreté"
        }>;
        classification: {
          code: string; // "1",
          label: string; //"Classe 1 - de 1 à 3 exécutants"
        };
      };
      assurance_decennale: {
        nom: string; // "AXA",
        date_debut: string; // "2024-01-31",
        date_fin: string; // "2024-12-31"
      };
      assurance_civile: {
        nom: string; // "HISCOX",
        date_debut: string; // "2024-01-31"
        date_fin: string; // "2024-12-31"
      };
    };
    links: {};
    meta: {};
  }>
>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseQualifelec = async (
  siret: Siret,
  recipientSiret: Siret | undefined
) => {
  return await clientAPIEntreprise<IAPIEntrepriseQualifelec, IQualifelec>(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.certifications.qualifelec.replace(
      '{siret}',
      siret
    )}`,
    mapToDomainObject,
    recipientSiret
  );
};

const mapToDomainObject = (response: IAPIEntrepriseQualifelec): IQualifelec => {
  return response.data.map((item) => ({
    documentUrl: item.data.document_url,
    numero: item.data.numero,
    rge: item.data.rge,
    dateDebut: item.data.date_debut,
    dateFin: item.data.date_fin,
    qualification: {
      label: item.data.qualification.label,
      dateDebut: item.data.qualification.date_debut,
      dateFin: item.data.qualification.date_fin,
      indices: item.data.qualification.indices.map((indice) => ({
        code: indice.code,
        label: indice.label,
      })),
      mentions: item.data.qualification.mentions.map((mention) => ({
        code: mention.code,
        label: mention.label,
      })),
      domaines: item.data.qualification.domaines.map((domaine) => ({
        code: domaine.code,
        label: domaine.label,
      })),
      classification: {
        code: item.data.qualification.classification.code,
        label: item.data.qualification.classification.label,
      },
    },
    assuranceCivile: {
      nom: item.data.assurance_civile.nom,
      dateDebut: item.data.assurance_civile.date_debut,
      dateFin: item.data.assurance_civile.date_fin,
    },
    assuranceDecennale: {
      nom: item.data.assurance_decennale.nom,
      dateDebut: item.data.assurance_decennale.date_debut,
      dateFin: item.data.assurance_decennale.date_fin,
    },
  }));
};
