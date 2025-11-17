import { clientApiEntrepriseMandatairesRCS } from "#clients/api-entreprise/mandataires-rcs";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#models/api-not-responding";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import type { IDirigeants } from "#models/rne/types";
import { verifySiren } from "#utils/helpers";
import { handleApiEntrepriseError } from "./utils";

export const getMandatairesRCS = async (
  maybeSiren: string,
  scope: IAgentScope | null
): Promise<IDirigeants | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  try {
    const mandatairesRCS = await clientApiEntrepriseMandatairesRCS(
      siren,
      scope
    );
    if (mandatairesRCS.length === 0) {
      return APINotRespondingFactory(EAdministration.INFOGREFFE, 404);
    }
    return mandatairesRCS;
  } catch (error) {
    return handleApiEntrepriseError(error, {
      siren,
      apiResource: "MandatairesRCS",
    });
  }
};
