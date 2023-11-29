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
  clientAPIProxy<IActesRNE>(routes.proxy.rne.documents.list + siren, {
    timeout: constants.timeout.XXXXL,
    useCache,
  });

const clientDownloadActe = async (id: string) =>
  clientAPIProxy<string>(routes.proxy.rne.documents.download.acte + id, {
    timeout: constants.timeout.XXXXL,
    responseType: 'arraybuffer',
  });

const clientDownloadBilan = async (id: string) =>
  clientAPIProxy<string>(routes.proxy.rne.documents.download.bilan + id, {
    timeout: constants.timeout.XXXXL,
    responseType: 'arraybuffer',
  });

const stubbedClient = stubClientWithSnapshots({
  fetchActesFromRNE,
});

export {
  stubbedClient as clientActes,
  clientDownloadActe,
  clientDownloadBilan,
};
