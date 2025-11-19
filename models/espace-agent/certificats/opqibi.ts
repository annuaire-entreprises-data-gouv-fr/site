import { clientApiEntrepriseOpqibi } from "#clients/api-entreprise/opqibi";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import { verifySiren } from "#utils/helpers";
import { handleApiEntrepriseError } from "../utils";

type Qualification = {
  nom: string;
  codeQualification: string;
  definition: string;
  rge: boolean;
};
export type IOpqibi = {
  numeroCertificat: string;
  url: string;
  dateDelivranceCertificat: string;
  dureeValiditeCertificat: string;
  assurances: string;
  qualifications: Array<Qualification>;
  dateValiditeQualifications: string;
  qualificationsProbatoires: Array<Qualification>;
  dateValiditeQualificationsProbatoires: string;
};

export const getOpqibi = async (
  maybeSiren: string,
  scope: IAgentScope | null
): Promise<IOpqibi | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseOpqibi(siren, scope).catch((error) =>
    handleApiEntrepriseError(error, { siren, apiResource: "Opqibi" })
  );
};
