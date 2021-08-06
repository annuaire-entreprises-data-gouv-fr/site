import { HttpNotFound } from '../clients/exceptions';
import { fetchRNCSImmatriculation } from '../clients/rncs';
import { fetchRnmImmatriculation } from '../clients/rnm';
import { Siren } from '../utils/helpers/siren-and-siret';

import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from './api-not-responding';

export interface IImmatriculation {
  downloadlink: string;
}
export interface IImmatriculationRNCS extends IImmatriculation {
  siren: Siren;
  immatriculation: {};
}

export interface IImmatriculationRNM extends IImmatriculation {
  siren: Siren;
  immatriculation: {
    codeAPRM: string | null;
    activitésArtisanalesDéclarées: string | null;
    dirigeantQualification: string | null;
  };
}

/**
 * Request Immatriculation from CMA-France's RNM
 * @param siren
 */
export const getImmatriculationRNM = async (siren: Siren) => {
  try {
    return await fetchRnmImmatriculation(siren);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.CMAFRANCE, 404);
    }

    logErrorInSentry(new Error('Error in API RNM'), {
      siren,
      details: JSON.stringify(e.message),
    });

    return APINotRespondingFactory(EAdministration.CMAFRANCE, 500);
  }
};
/**
 * Request Immatriculation from INPI's RNCS
 * @param siren
 */
export const getImmatriculationRNCS = async (siren: Siren) => {
  try {
    return await fetchRNCSImmatriculation(siren);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    logErrorInSentry(new Error('Error in API INPI'), {
      siren,
      details: JSON.stringify(e.message),
    });
    return APINotRespondingFactory(EAdministration.INPI, 500);
  }
};
