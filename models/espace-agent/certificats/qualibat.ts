import { clientApiEntrepriseQualibat } from '#clients/api-entreprise/qualibat';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiret } from '#utils/helpers';
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
  maybeSiret: string
): Promise<IQualibat | IAPINotRespondingError> => {
  const siret = verifySiret(maybeSiret);
  return clientApiEntrepriseQualibat(siret).catch((error) =>
    handleApiEntrepriseError(error, { siret, apiResource: 'Qualibat' })
  );
};
