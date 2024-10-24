import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import { IActesRNE } from '#models/rne/types';
import { Siren } from '#utils/helpers';
import { sensitiveRequestCallerInfos } from '#utils/network/utils/sensitive-request-caller-infos';
import { sensitiveRequestLogger } from '#utils/network/utils/sensitive-request-logger';
import { clientAPIProxy } from '../client';

/**
 * RNE through the API proxy
 * @param siren
 */
const fetchDocumentsFromRNE = async (siren: Siren) => {
  const route = routes.proxy.rne.documents.list + siren;

  const callerInfos = await sensitiveRequestCallerInfos();
  sensitiveRequestLogger(route, callerInfos);

  return await clientAPIProxy<IActesRNE>(route, {
    timeout: constants.timeout.XXXXL,
  });
};

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
  fetchDocumentsFromRNE,
});

export {
  stubbedClient as clientDocuments,
  clientDownloadActe,
  clientDownloadBilan,
};
