import { clientBanGeoLoc } from '#clients/base-adresse';
import logErrorInSentry from '#utils/sentry';
import { IEtablissement } from '.';

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
    return await clientBanGeoLoc(etablissement.adresse);
  } catch (e: any) {
    logErrorInSentry('Error in API Geoloc', {
      siren: etablissement.siren,
      details: JSON.stringify(e.message),
    });

    return { lat: '', long: '' };
  }
};
