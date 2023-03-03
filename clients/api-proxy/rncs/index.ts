import routes from '#clients/routes';
import constants from '#models/constants';
import { IImmatriculationRNCSCore } from '#models/immatriculation/rncs';
import { Siren } from '#utils/helpers';
import { clientAPIProxy } from '../client';

/**
 * RNCS IMR through the API proxy
 * @param siren
 */
export const fetchRNCSImmatriculation = async (siren: Siren, useCache = true) =>
  clientAPIProxy(
    routes.rncs.proxy.imr + siren,
    { timeout: constants.timeout.XL },
    useCache
  ) as Promise<IImmatriculationRNCSCore>;
