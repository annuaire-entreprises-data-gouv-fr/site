import axios from "axios";
import { clientRNEImmatriculation } from "#clients/api-proxy/rne";
import { HttpNotFound } from "#clients/exceptions";
import { clientDirigeantsRechercheEntreprise } from "#clients/recherche-entreprise/dirigeants";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#models/api-not-responding";
import { type Siren, verifySiren } from "#utils/helpers";
import type { IDirigeantsWithMetadata } from "./types";

// Value returned when the request is aborted
const ABORTED_VALUE = { data: [], metadata: { isFallback: false } };

const fallback = async (siren: Siren, signal?: AbortSignal) => {
  const dirigeants = await clientDirigeantsRechercheEntreprise(siren, signal);
  return { data: dirigeants, metadata: { isFallback: true } };
};

/*
 * Request dirigeants from INPI's RNE
 * @param siren
 */
export const getDirigeantsRNE = async (
  maybeSiren: string,
  params: { signal?: AbortSignal }
): Promise<IAPINotRespondingError | IDirigeantsWithMetadata> => {
  const siren = verifySiren(maybeSiren);

  if (params.signal?.aborted) {
    return ABORTED_VALUE;
  }

  try {
    const { dirigeants } = await clientRNEImmatriculation(siren, params.signal);
    return { data: dirigeants, metadata: { isFallback: false } };
  } catch (e: any) {
    if (axios.isCancel(e)) {
      return ABORTED_VALUE;
    }
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    try {
      return await fallback(siren, params.signal);
    } catch (eFallback) {
      if (axios.isCancel(eFallback)) {
        return ABORTED_VALUE;
      }
      if (eFallback instanceof HttpNotFound) {
        return APINotRespondingFactory(EAdministration.INPI, 404);
      }
      return APINotRespondingFactory(EAdministration.INPI, 500);
    }
  }
};
