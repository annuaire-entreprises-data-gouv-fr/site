import { clientApiEntrepriseQualibat } from '#clients/api-entreprise/qualibat';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { Siret } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';
export type IQualibat = {
  documentUrl: string;
  dateEmission: string | null;
  dateFinValidite: string | null;
  informationsAdditionnelles: {
    assuranceResponsabiliteTravaux: {
      nom: string;
      identifiant: string;
    };
    assuranceResponsabiliteCivile: {
      nom: string;
      identifiant: string;
    };
    certifications: Array<{
      code: string;
      libelle: string;
      rge: boolean;
      dateAttribution: string;
    }>;
  } | null;
};

export const getQualibat = async (
  siret: Siret,
  recipientSiret?: string
): Promise<IQualibat | IAPINotRespondingError> => {
  return clientApiEntrepriseQualibat(siret, recipientSiret).catch((error) =>
    handleApiEntrepriseError(error, { siret })
  );
};
