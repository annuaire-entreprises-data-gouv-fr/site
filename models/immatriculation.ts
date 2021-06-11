import { HttpNotFound } from '../clients/exceptions';
import { fetchRncsImmatriculation } from '../clients/rncs';
import { fetchRnmImmatriculation } from '../clients/rnm';
import { Siren } from '../utils/helpers/siren-and-siret';

import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administration';
import { IAPINotRespondingError } from './api-not-responding';

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
const getImmatriculationRNM = async (
  siren: Siren
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

    logErrorInSentry(new Error('Error in API RNM'), {
      siren,
      details: JSON.stringify(e.message),
    });
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
  siren: Siren
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

    logErrorInSentry(new Error('Error in API RNCS'), {
      siren,
      details: JSON.stringify(e.message),
    });
    return {
      administration: EAdministration.INPI,
      type: 500,
    };
  }
};

export { getImmatriculationRNCS, getImmatriculationRNM };
