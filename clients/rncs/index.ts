import { IImmatriculationRNCSCore } from '../../models/immatriculation/rncs';
import { Siren } from '../../utils/helpers/siren-and-siret';
import routes from '../routes';
import APIRncsProxyClient from './rncs-proxy-client';

/**
 * This is the method to call in order to get RNCS immatriculation
 * First call on API IMR and fallback on INPI site parser
 * @param siren
 * @returns
 */
export const fetchRNCSImmatriculation = async (siren: Siren) => {
  const request = await APIRncsProxyClient({
    url: routes.rncs.proxy.imr + siren,
  });

  return request.data as IImmatriculationRNCSCore;
};
