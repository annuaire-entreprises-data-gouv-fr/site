import { rncsAuth } from '.';
import { IImmatriculationRNCS } from '../../models/immatriculation';
import { fetchWithTimeout } from '../../utils/network/fetch-with-timeout';
import { HttpNotFound, HttpTooManyRequests } from '../exceptions';
import routes from '../routes';

interface IApiRNCSResponse {}

export const fetchRncsImmatriculation = async (siren: string) => {
  const cookie = await rncsAuth();
  const response = await fetchWithTimeout(routes.rncs.api.imr + siren, {
    headers: { Cookie: cookie },
  });

  if (response.status === 404) {
    throw new HttpNotFound(404, `Siren ${siren} not found in RNCS`);
  }

  if (response.status === 429) {
    throw new HttpTooManyRequests(429, `Too many requests in RNCS`);
  }

  const result = await response.json();
  if (result.length === 0) {
    throw new HttpNotFound(404, `Siren ${siren} not found in RNCS`);
  }

  return mapToDomainObject(siren, result);
};

const mapToDomainObject = (
  siren: string,
  apiRncsResponse: IApiRNCSResponse
): IImmatriculationRNCS => {
  return {
    immatriculation: apiRncsResponse,
    downloadlink: routes.rncs.portail + siren,
  };
};
