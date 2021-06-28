import { RNCSClientWrapper } from '.';
import { IImmatriculationRNCS } from '../../models/immatriculation';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { HttpNotFound } from '../exceptions';
import routes from '../routes';

interface IApiRNCSResponse {}

/**
 * Checks if justificatifs exists in RNCS
 * @param siren
 * @returns
 */
export const fetchRNCSImmatriculation = async (siren: Siren) => {
  const response = await RNCSClientWrapper(
    routes.rncs.api.imr.find + siren,
    {}
  );

  const result = response.data;
  if (result.length === 0) {
    throw new HttpNotFound(404, `Siren ${siren} not found in RNCS`);
  }

  return mapToDomainObject(siren, result);
};

const mapToDomainObject = (
  siren: Siren,
  apiRNCSResponse: IApiRNCSResponse
): IImmatriculationRNCS => {
  return {
    siren,
    immatriculation: apiRNCSResponse,
    downloadlink: routes.rncs.portail.entreprise + siren,
  };
};
