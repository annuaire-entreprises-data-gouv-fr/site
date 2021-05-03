import { HttpNotFound } from '../clients/exceptions';
import { fetchRncsImmatriculation } from '../clients/rncs';
import { fetchRnmImmatriculation } from '../clients/rnm';

import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administration';
import { IAPINotRespondingError } from './api-not-responding';

export interface IImmatriculation {
  downloadlink: string;
}
export interface IImmatriculationRNCS extends IImmatriculation {
  immatriculation: {};
}

export interface IImmatriculationRNM extends IImmatriculation {
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
const getImmatriculationRNM = async (
  siren: string
): Promise<IImmatriculationRNM | IAPINotRespondingError> => {
  try {
    return await fetchRnmImmatriculation(siren);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      return {
        administration: EAdministration.CMAFRANCE,
        type: 404,
      };
    }

    logErrorInSentry(new Error(`Error in API RNM for ${siren} : ${e}`));
    return {
      administration: EAdministration.CMAFRANCE,
      type: 500,
    };
  }
};
/**
 * Request Immatriculation from INPI's RNCS
 * @param siren
 */
const getImmatriculationRNCS = async (
  siren: string
): Promise<IImmatriculationRNCS | IAPINotRespondingError> => {
  try {
    return await fetchRncsImmatriculation(siren);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      return {
        administration: EAdministration.INPI,
        type: 404,
      };
    }

    logErrorInSentry(new Error(`Error in API RNCS for ${siren} : ${e}`));
    return {
      administration: EAdministration.INPI,
      type: 500,
    };
  }
};

export { getImmatriculationRNCS, getImmatriculationRNM };
