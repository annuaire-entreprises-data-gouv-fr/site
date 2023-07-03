import routes from '#clients/routes';
import constants from '#models/constants';
import { IImmatriculationRNE } from '#models/immatriculation';
import { Siren } from '#utils/helpers';
import { clientAPIProxy } from '../client';

/**
 * RNE through the API proxy
 * @param siren
 */
export const fetchRNEImmatriculation = async (siren: Siren, useCache = true) =>
  clientAPIProxy(
    routes.rne.proxy.rne + siren,
    { timeout: constants.timeout.XL },
    useCache
  ) as Promise<IImmatriculationRNE>;
