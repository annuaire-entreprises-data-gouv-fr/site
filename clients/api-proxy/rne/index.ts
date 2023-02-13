import routes from '#clients/routes';
import { IImmatriculationRNCSCore } from '#models/immatriculation/rncs';
import { IImmatriculationRNE } from '#models/immatriculation/rne';
import { Siren } from '#utils/helpers';
import { clientAPIProxy } from '../client';

/**
 * RNE through the API proxy
 * @param siren
 */
export const fetchRNEImmatriculation = async (siren: Siren, useCache = true) =>
  clientAPIProxy(
    routes.rne.proxy.rne + siren,
    useCache
  ) as Promise<IImmatriculationRNE>;
