import routes from '#clients/routes';
import { IQualibat } from '#models/espace-agent/qualibat';
import { Siret } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseQualibat = IAPIEntrepriseResponse<{
  document_url: string; // "https://storage.entreprise.api.gouv.fr/siade/1635521735-1a675fc210d09e04604aabe5e93b452fb56865f5-certificat_qualibat.pdf",
  document_url_expires_in: number; // 86400
  date_emission: string; //"2023-01-01",
  date_fin_validite: string; //"2024-02-02",
  entity?: {
    assurance_responsabilite_travaux: {
      nom: string; //"GROUPAMA",
      identifiant: string; //"1234567890"
    };
    assurance_responsabilite_civile: {
      nom: string; //"GROUPAMA",
      identifiant: string; //"1234567890"
    };
    certifications: Array<{
      code: string; // "4322",
      libelle: string; // "Fabrication et pose de menuiserie intérieure en bois",
      rge: boolean; // false,
      date_attribution: string; // "2022-03-03"
    }>;
  };
}>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseQualibat = async (
  siret: Siret,
  recipientSiret: Siret | undefined
) => {
  return await clientAPIEntreprise(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.certifications.qualibat.replace('{siret}', siret)}`,
    mapToDomainObject,
    recipientSiret
  );
};

const mapToDomainObject = ({ data }: IAPIEntrepriseQualibat): IQualibat => {
  return {
    documentUrl: data.document_url,
    dateEmission: data.date_emission,
    dateFinValidite: data.date_fin_validite,
    informationsAdditionnelles: data.entity
      ? {
          assuranceResponsabiliteTravaux: {
            nom: data.entity.assurance_responsabilite_travaux.nom,
            identifiant:
              data.entity.assurance_responsabilite_travaux.identifiant,
          },
          assuranceResponsabiliteCivile: {
            nom: data.entity.assurance_responsabilite_civile.nom,
            identifiant:
              data.entity.assurance_responsabilite_civile.identifiant,
          },
          certifications: data.entity.certifications.map((certification) => ({
            code: certification.code,
            libelle: certification.libelle,
            rge: certification.rge,
            dateAttribution: certification.date_attribution,
          })),
        }
      : null,
  };
};
