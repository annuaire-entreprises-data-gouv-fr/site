import { IEtablissement } from '.';
import { fetchBanGeoLoc } from '../clients/base-adresse';
import { HttpNotFound } from '../clients/exceptions';

import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administration';
import { APINotRespondingFactory } from './api-not-responding';

export interface IGeoLoc {
  lat: number;
  long: number;
}

/**
 * Request request a GeoLoc
 * @param siren
 */
export const getGeoLoc = async (etablissement: IEtablissement) => {
  try {
    return await fetchBanGeoLoc(etablissement);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      return { lat: null, long: null };
    }

    logErrorInSentry(new Error('Error in API RNM'), {
      siren: etablissement.siren,
      details: JSON.stringify(e.message),
    });

    return APINotRespondingFactory(EAdministration.DINUM, 500);
  }
};
