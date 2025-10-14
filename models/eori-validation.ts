import { clientEORI } from "#clients/api-proxy/eori";
import { verifySiret } from "#utils/helpers";
import logErrorInSentry from "#utils/sentry";
import { EAdministration } from "./administrations/EAdministration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "./api-not-responding";
import { FetchRessourceException } from "./exceptions";

export type IEORIValidation = {
  eori: string;
  isValid: boolean;
};

export const getEORIValidation = async (
  siret: string
): Promise<IEORIValidation | IAPINotRespondingError> => {
  try {
    const data = await clientEORI(verifySiret(siret));
    if (!data) {
      throw new Error("EOS response is empty");
    }
    return data;
  } catch (e: any) {
    logErrorInSentry(
      new FetchRessourceException({
        ressource: "EORIValidation",
        cause: e,
        context: { slug: siret },
      })
    );
    return APINotRespondingFactory(EAdministration.DOUANES, e.status || 500);
  }
};
