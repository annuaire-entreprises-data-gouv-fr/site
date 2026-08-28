import { clientEss } from "#/clients/api-data-gouv/ess";
import { HttpNotFound } from "#/clients/exceptions";
import { EAdministration } from "#/models/administrations/e-administration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#/models/api-not-responding";
import { FetchRessourceException } from "#/models/exceptions";
import type { Siren } from "#/utils/helpers";
import logErrorInSentry from "#/utils/sentry";

export interface IESS {
  familleJuridique: string;
  nom: string;
  region: string;
}

export const getEss = async (
  siren: Siren,
  estEss: boolean
): Promise<IESS | IAPINotRespondingError> => {
  try {
    if (!estEss) {
      return APINotRespondingFactory(EAdministration.ESSFRANCE, 404);
    }
    return await clientEss(siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.ESSFRANCE, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: "EconomieSocialeEtSolidaire",
        context: {
          siren,
        },
        administration: EAdministration.ESSFRANCE,
      })
    );
    return APINotRespondingFactory(EAdministration.ESSFRANCE, 500);
  }
};
