import { IImmatriculationRNCSCore } from '../../models/immatriculation/rncs';
import { Siren } from '../../utils/helpers/siren-and-siret';
import routes from '../routes';
import { APIRncsProxyGet } from './rncs-proxy-client';

const factory = async (siren: Siren, useCache: boolean) => {
  const request = await APIRncsProxyGet(
    routes.rncs.proxy.imr + siren,
    {},
    useCache
  );

  return request.data as IImmatriculationRNCSCore;
};

/**
 * RNCS IMR through the API Rncs proxy
 * @param siren
 */
export const fetchRNCSImmatriculation = async (siren: Siren) =>
  factory(siren, true);

/**
 * RNCS IMR through the API Rncs proxy - disable cache
 * @param siren
 */
export const fetchRNCSImmatriculationNoCache = async (siren: Siren) =>
  factory(siren, false);
