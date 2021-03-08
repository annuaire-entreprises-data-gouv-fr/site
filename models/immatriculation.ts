import { RncsHttpServerError, fetchRncsImmatriculation } from '../clients/rncs';
import { RnmHttpServerError, fetchRnmImmatriculation } from '../clients/rnm';
import routes from '../clients/routes';

import logErrorInSentry from '../utils/sentry';
import { EAdministration, IAPINotRespondingError } from './api-not-responding';

export interface IImmatriculation {
  downloadlink: string;
}
export interface IImmatriculationRNCS extends IImmatriculation {
  immatriculation: any;
}
export interface IImmatriculationRNM extends IImmatriculation {
  immatriculation: any;
}

/**
 * Request Immatriculation from CMA-France's RNM
 * @param siren
 */
const getImmatriculationRNM = async (
  siren: string
): Promise<IImmatriculationRNM | IAPINotRespondingError> => {
  try {
    const immatriculation = await fetchRnmImmatriculation(siren);
    return {
      immatriculation,
      downloadlink: routes.rnm + siren,
    };
  } catch (e) {
    if (e instanceof RnmHttpServerError) {
      logErrorInSentry(`Error in API RNM for ${siren} : ${e}`);
    }
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
    const immatriculation = await fetchRncsImmatriculation(siren);
    return {
      immatriculation,
      downloadlink: routes.rncs.portail + siren,
    };
  } catch (e) {
    if (e instanceof RncsHttpServerError) {
      logErrorInSentry(`Error in API RNCS for ${siren} : ${e}`);
    }
    return {
      administration: EAdministration.INPI,
      type: 500,
    };
  }
};

export { getImmatriculationRNCS, getImmatriculationRNM };
