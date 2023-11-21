import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import { IActesRNE } from '#models/immatriculation';
import { Siren } from '#utils/helpers';
import { clientAPIProxy } from '../client';

/**
 * RNE through the API proxy
 * @param siren
 */
const fetchActesFromRNE = async (siren: Siren, useCache = true) =>
  clientAPIProxy<IActesRNE>(routes.proxy.actes + siren, {
    timeout: constants.timeout.XXXXL,
    useCache,
  });

const stubbedClient = stubClientWithSnapshots({
  fetchActesFromRNE,
});

export { stubbedClient as clientActes };
