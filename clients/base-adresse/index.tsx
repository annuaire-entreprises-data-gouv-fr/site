import { IEtablissement } from '../../models';
import constants from '../../models/constants';
import { IGeoLoc } from '../../models/geo-loc';
import { httpGet } from '../../utils/network';
import { HttpNotFound } from '../exceptions';
import routes from '../routes';

interface IBANResponse {
  features: {
    geometry: {
      coordinates: number[];
    };
    properties: { label: string };
  }[];
}

/**
 * GET adress for geoloc
 */
const fetchBanGeoLoc = async (
  etablissement: IEtablissement
): Promise<IGeoLoc> => {
  const route = `${routes.ban}${etablissement.adresse.replaceAll(' ', '+')}`;
  const response = await httpGet(route, { timeout: constants.timeout.L });

  return mapToDomainObject(response.data as IBANResponse);
};

const reverseGeoLoc = async (adresse: string): Promise<IGeoLoc> => {
  const route = `${routes.ban}${adresse.replaceAll(' ', '+')}`;
  const response = await httpGet(route);

  return mapToDomainObject(response.data as IBANResponse);
};

const mapToDomainObject = (response: IBANResponse): IGeoLoc => {
  const { features } = response;
  if (features.length === 0) {
    throw new HttpNotFound('No results in API BAN');
  }
  const coordinates = features[0].geometry.coordinates;
  return {
    lat: coordinates[1].toString(),
    long: coordinates[0].toString(),
    geoCodedAdress: features[0].properties.label,
  };
};

export { fetchBanGeoLoc, reverseGeoLoc };
