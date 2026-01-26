import axios from "axios";
import { clientTVA } from "#clients/api-proxy/tva";
import { HttpNotFound } from "#clients/exceptions";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#models/api-not-responding";
import { verifySiren, verifyTVANumber } from "#utils/helpers";
import { tvaNumber } from "./utils";

// Value returned when the request is aborted
const ABORTED_VALUE = { tva: null };

export const buildAndVerifyTVA = async (
  slug: string,
  controller?: AbortController
): Promise<{ tva: string | null } | IAPINotRespondingError> => {
  if (controller?.signal.aborted) {
    return ABORTED_VALUE;
  }

  const siren = verifySiren(slug);
  const tvaNumberFromSiren = verifyTVANumber(tvaNumber(siren));

  try {
    return { tva: await clientTVA(tvaNumberFromSiren, true, controller) };
  } catch (e: any) {
    if (axios.isCancel(e)) {
      return ABORTED_VALUE;
    }
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.VIES, 404);
    }
    return APINotRespondingFactory(EAdministration.VIES, e?.status || 500);
  }
};
