import { clientRNCSProxy } from '#clients/rncs/rncs-proxy-client';
import routes from '#clients/routes';
import { IImmatriculationRNCSCore } from '#models/immatriculation/rncs';
import { Siren } from '#utils/helpers';

const factory = async (siren: Siren, useCache: boolean) => {
  const request = await clientRNCSProxy(
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
