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
    return await fetchRNCSImmatriculationFromSite(siren);
    return await fetchRNCSImmatriculationFromAPI(siren);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      throw e;
    }
    try {
      return await fetchRNCSImmatriculationFromSite(siren);
    } catch (e2) {
      if (e instanceof HttpNotFound) {
        throw e;
      }
      throw new HttpServerError(500, `API : ${e} | Site : ${e2}`);
    }
  }
};

export {
  fetchRNCSImmatriculation,
  fetchRNCSImmatriculationFromSite,
  fetchRNCSImmatriculationFromAPI,
};
