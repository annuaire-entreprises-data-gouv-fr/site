import { fetchRNCSImmatriculationFromSite } from './site';
import { fetchRNCSImmatriculationFromAPI } from './api';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { HttpNotFound, HttpServerError } from '../exceptions';

/**
 * This is the method to call in order to get RNCS immatriculation
 * First call on API IMR and fallback on INPI site parser
 * @param siren
 * @returns
 */
const fetchRNCSImmatriculation = async (siren: Siren) => {
  try {
    return await fetchRNCSImmatriculationFromAPI(siren);
  } catch (error) {
    if (error instanceof HttpNotFound) {
      throw error;
    }
    try {
      return await fetchRNCSImmatriculationFromSite(siren);
    } catch (fallbackError) {
      if (fallbackError instanceof HttpNotFound) {
        throw fallbackError;
      }
      throw new HttpServerError(
        500,
        `API : ${error} | Site : ${fallbackError}`
      );
    }
  }
};

export {
  fetchRNCSImmatriculation,
  fetchRNCSImmatriculationFromSite,
  fetchRNCSImmatriculationFromAPI,
};
