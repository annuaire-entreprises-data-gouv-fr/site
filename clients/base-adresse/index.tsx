import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { IGeoLoc } from '#models/geo-loc';
import { httpGet } from '#utils/network';

type IBANResponse = {
  features: {
    geometry: {
      coordinates: number[];
    };
    properties: { label: string };
  }[];
};

/**
 * GET address for geoloc
 */
const clientBanGeoLoc = async (adresse: string): Promise<IGeoLoc> => {
  // remove all characters that are not digits or letters at the begining of adress as it triggers a 400
  const sanitizedAdress = adresse
    .replace(/^[^a-zA-Z0-9]*/, '')
    .replaceAll(' ', '+');

  const route = `${routes.ban}${sanitizedAdress}`;
  const response = await httpGet(route, { timeout: constants.timeout.L });

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

export { clientBanGeoLoc };
