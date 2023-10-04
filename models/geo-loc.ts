import { clientBanGeoLoc } from '#clients/base-adresse';
import logErrorInSentry from '#utils/sentry';
import { IEtablissement } from '.';
import { estDiffusible } from './statut-diffusion';

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
    if (estDiffusible(etablissement) && etablissement.adresse) {
      return await clientBanGeoLoc(etablissement.adresse);
    }
    return { lat: '', long: '' };
  } catch (e: any) {
    return { lat: '', long: '' };
  }
};
