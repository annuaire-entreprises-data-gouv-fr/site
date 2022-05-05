import { IImmatriculationRNCSCore } from '../../models/immatriculation/rncs';
import { Siren } from '../../utils/helpers/siren-and-siret';
import routes from '../routes';
import { APIRncsProxyGet } from './rncs-proxy-client';

/**
 * RNCS IMR through the API Rncs proxy
 * @param siren
 * @returns
 */
export const fetchRNCSImmatriculation = async (
  siren: Siren,
  useCache = true // cache for RNCS IMR
) => {
  const request = await APIRncsProxyGet(
    routes.rncs.proxy.imr + siren,
    {},
    useCache
  );

  return request.data as IImmatriculationRNCSCore;
};
