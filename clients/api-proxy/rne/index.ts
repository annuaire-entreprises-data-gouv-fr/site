import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import { IImmatriculationRNE } from '#models/immatriculation';
import { Siren } from '#utils/helpers';
import { clientAPIProxy } from '../client';

/**
 * RNE through the API proxy
 * @param siren
 */
const fetchRNEImmatriculation = async (siren: Siren, useCache = true) =>
  clientAPIProxy<IImmatriculationRNE>(routes.proxy.rne + siren, {
    timeout: constants.timeout.XXXXL,
    useCache,
  });

const stubbedClient = stubClientWithSnapshots({
  fetchRNEImmatriculation,
});

export { stubbedClient as fetchRNEImmatriculation };
