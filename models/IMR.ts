import { HttpNotFound, HttpServerError } from '../clients/exceptions';
import { fetchRNCSImmatriculation } from '../clients/rncs/IMR-api';
import { fetchRNCSImmatriculationSiteFallback } from '../clients/rncs/IMR-site';
import { Siren } from '../utils/helpers/siren-and-siret';

/**
 * First request API IMR and fallback on INPI site parser
 * @param siren
 * @returns
 */
const getIMR = async (siren: Siren) => {
  try {
    return await fetchRNCSImmatriculationSiteFallback(siren);
    return await fetchRNCSImmatriculation(siren);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      throw e;
    }
    try {
      return await fetchRNCSImmatriculationSiteFallback(siren);
    } catch (e2) {
      if (e instanceof HttpNotFound) {
        throw e;
      }
      throw new HttpServerError(500, `API : ${e} | Site : ${e2}`);
    }
  }
};

export default getIMR;
