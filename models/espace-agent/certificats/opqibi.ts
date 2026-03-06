import { clientApiEntrepriseOpqibi } from "#clients/api-entreprise/opqibi";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#models/authentication/user/rights";
import { verifySiren } from "#utils/helpers";
import { handleApiEntrepriseError } from "../utils";

interface Qualification {
  codeQualification: string;
  definition: string;
  nom: string;
  rge: boolean;
}
export interface IOpqibi {
  assurances: string;
  dateDelivranceCertificat: string;
  dateValiditeQualifications: string;
  dateValiditeQualificationsProbatoires: string;
  dureeValiditeCertificat: string;
  numeroCertificat: string;
  qualifications: Array<Qualification>;
  qualificationsProbatoires: Array<Qualification>;
  url: string;
}

export const getOpqibi = async (
  maybeSiren: string
): Promise<IOpqibi | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseOpqibi(
    siren,
    ApplicationRightsToScopes[ApplicationRights.protectedCertificats]
  ).catch((error) =>
    handleApiEntrepriseError(error, { siren, apiResource: "Opqibi" })
  );
};
