import axios from "axios";
import {
  clientRNEImmatriculation,
  clientRNEObservationsFallback,
} from "#clients/api-proxy/rne";
import { HttpNotFound } from "#clients/exceptions";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#models/api-not-responding";
import { type Siren, verifySiren } from "#utils/helpers";
import type { IObservationsWithMetadata } from "./types";

// Value returned when the request is aborted
const ABORTED_VALUE = { data: [], metadata: { isFallback: false } };

const fallback = async (siren: Siren, signal?: AbortSignal) => {
  const observations = await clientRNEObservationsFallback(siren, signal);
  return { data: observations, metadata: { isFallback: true } };
};

/*
 * Request observations from INPI's RNE
 * @param siren
 */
export const getRNEObservations = async (
  maybeSiren: string,
  params: { signal?: AbortSignal }
): Promise<IAPINotRespondingError | IObservationsWithMetadata> => {
  const siren = verifySiren(maybeSiren);

  if (params.signal?.aborted) {
    return ABORTED_VALUE;
  }

  try {
    const { observations } = await clientRNEImmatriculation(
      siren,
      params.signal
    );
    return { data: observations, metadata: { isFallback: false } };
  } catch (eDefaultTry: any) {
    if (axios.isCancel(eDefaultTry)) {
      return ABORTED_VALUE;
    }
    if (eDefaultTry instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    try {
      return await fallback(siren, params.signal);
    } catch (eFallback: any) {
      if (axios.isCancel(eFallback)) {
        return ABORTED_VALUE;
      }
      if (eFallback instanceof HttpNotFound) {
        return APINotRespondingFactory(EAdministration.INPI, 404);
      }

      // no need to log an error as API-Proxy already logged it
      return APINotRespondingFactory(EAdministration.INPI, 500);
    }
  }
};
