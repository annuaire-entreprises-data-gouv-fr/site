import { clientBanGeoLoc } from '#clients/base-adresse-nationale';
import { estDiffusible } from './core/diffusion';
import { IEtablissement } from './core/types';

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
