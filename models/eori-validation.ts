import axios from "axios";
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

// Value returned when the request is aborted
const ABORTED_VALUE = { eori: "", isValid: false };

export const getEORIValidation = async (
  siret: string,
  params: { signal?: AbortSignal }
): Promise<IEORIValidation | IAPINotRespondingError> => {
  try {
    if (params.signal?.aborted) {
      return ABORTED_VALUE;
    }
    const data = await clientEORI(verifySiret(siret), params.signal);
    if (!data) {
      throw new Error("EOS response is empty");
    }
    return data;
  } catch (e: any) {
    if (axios.isCancel(e)) {
      return ABORTED_VALUE;
    }
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
