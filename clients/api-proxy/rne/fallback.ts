import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import { IImmatriculationRNE } from '#models/immatriculation';
import { Siren } from '#utils/helpers';
import { clientAPIProxy } from '../client';

/**
 * RNE through the API proxy - scrapping site as fallback
 * @param siren
 */
const fetchRNEImmatriculationFallback = async (siren: Siren, useCache = true) =>
  clientAPIProxy<IImmatriculationRNE>(
    routes.proxy.rne.immatriculation.fallback + siren,
    {
      timeout: constants.timeout.XXXL,
      useCache,
    }
  );

const stubbedClient = stubClientWithSnapshots({
  fetchRNEImmatriculationFallback,
});

export { stubbedClient as fetchRNEImmatriculationFallback };
