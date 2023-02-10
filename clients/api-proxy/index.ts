import { IAssociationResponse } from '#clients/association/interfaces';
import routes from '#clients/routes';
import { IImmatriculationRNCSCore } from '#models/immatriculation/rncs';
import { Siren } from '#utils/helpers';
import { clientAPIProxy } from './client';

const factory = async (route: string, useCache: boolean) => {
  const request = await clientAPIProxy(route, {}, useCache);

  return request.data;
};

/**
 * RNCS IMR through the API proxy
 * @param siren
 */
export const fetchRNCSImmatriculation = async (siren: Siren) =>
  factory(
    routes.rncs.proxy.imr + siren,
    true
  ) as Promise<IImmatriculationRNCSCore>;

/**
 * RNCS IMR through the API proxy - disable cache
 * @param siren
 */
export const fetchRNCSImmatriculationNoCache = async (siren: Siren) =>
  factory(
    routes.rncs.proxy.imr + siren,
    false
  ) as Promise<IImmatriculationRNCSCore>;

/**
 * Association through the API proxy
 * @param idRna
 */
export const fetchAssociation = async (idRna: string) =>
  factory(routes.association + idRna, true) as Promise<IAssociationResponse>;
