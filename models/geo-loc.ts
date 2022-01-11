import { IEtablissement } from '.';
import { fetchBanGeoLoc } from '../clients/base-adresse';

import logErrorInSentry from '../utils/sentry';

export interface IGeoLoc {
  lat: string;
  long: string;
  geoCodedAdress?: string;
}

/**
 * Request request a GeoLoc
 * @param siren
 */
export const getGeoLoc = async (etablissement: IEtablissement) => {
  try {
    return await fetchBanGeoLoc(etablissement);
  } catch (e: any) {
    logErrorInSentry(new Error('Error in API Geoloc'), {
      siren: etablissement.siren,
      details: JSON.stringify(e.message),
    });

    return { lat: '', long: '' };
  }
};
