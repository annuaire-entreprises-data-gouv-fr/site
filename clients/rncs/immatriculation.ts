import { rncsAuth } from '.';
import { IImmatriculationRNCS } from '../../models/immatriculation';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { httpGet } from '../../utils/network/http';
import { HttpNotFound, HttpTooManyRequests } from '../exceptions';
import routes from '../routes';

interface IApiRNCSResponse {}

export const fetchRncsImmatriculation = async (siren: Siren) => {
  const cookie = await rncsAuth();
  const response = await httpGet(routes.rncs.api.imr + siren, {
    headers: { Cookie: cookie },
  });

  if (response.length === 0) {
    throw new HttpNotFound(404, `Siren ${siren} not found in RNCS`);
  }

  return mapToDomainObject(siren, response);
};

const mapToDomainObject = (
  siren: Siren,
  apiRncsResponse: IApiRNCSResponse
): IImmatriculationRNCS => {
  return {
    siren,
    immatriculation: apiRncsResponse,
    downloadlink: routes.rncs.portail.entreprise + siren,
  };
};
