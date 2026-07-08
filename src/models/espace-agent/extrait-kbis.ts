import {
  clientApiEntrepriseExtraitKbis,
  type IExtraitKbis,
} from "#/clients/api-entreprise/extrait-kbis/index.server";
import type { IAPINotRespondingError } from "#/models/api-not-responding";
import type { IAgentScope } from "#/models/authentication/agent/scopes/constants";
import { verifySiren } from "#/utils/helpers";
import { handleApiEntrepriseError } from "./utils";

export const getExtraitKbis = async (
  maybeSiren: string,
  scope: IAgentScope | null
): Promise<IExtraitKbis | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  try {
    return await clientApiEntrepriseExtraitKbis(siren, scope);
  } catch (error) {
    return handleApiEntrepriseError(error, {
      siren,
      apiResource: "ExtraitKbis",
    });
  }
};
