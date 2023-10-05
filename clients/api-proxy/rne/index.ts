import routes from '#clients/routes';
import stubClient from '#clients/stub-client';
import constants from '#models/constants';
import { IImmatriculationRNE } from '#models/immatriculation';
import { Siren } from '#utils/helpers';
import { clientAPIProxy } from '../client';

/**
 * RNE through the API proxy
 * @param siren
 */
const fetchRNEImmatriculation = async (siren: Siren, useCache = true) =>
  clientAPIProxy(
    routes.proxy.rne + siren,
    { timeout: constants.timeout.XXL },
    useCache
  ) as Promise<IImmatriculationRNE>;

const stubbedClient = stubClient({
  fetchRNEImmatriculation,
});

export { stubbedClient as fetchRNEImmatriculation };
