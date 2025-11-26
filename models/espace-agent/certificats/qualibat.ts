import { clientApiEntrepriseQualibat } from "#clients/api-entreprise/certificats/qualibat";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#models/authentication/user/rights";
import { verifySiret } from "#utils/helpers";
import { handleApiEntrepriseError } from "../utils";
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
  return clientApiEntrepriseQualibat(
    siret,
    ApplicationRightsToScopes[ApplicationRights.protectedCertificats]
  ).catch((error) =>
    handleApiEntrepriseError(error, { siret, apiResource: "Qualibat" })
  );
};
