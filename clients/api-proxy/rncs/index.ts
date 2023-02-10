import routes from '#clients/routes';
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
    useCache
  ) as Promise<IImmatriculationRNCSCore>;
