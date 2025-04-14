import routes from '#clients/routes';
import constants from '#models/constants';
import { actesApiRneClient } from './auth';

export const clientDownloadActe = async (id: string) => {
  const encodedId = encodeURIComponent(id);
  const url = `${routes.inpi.api.rne.documents.download.actes}${encodedId}/download`;
  return await actesApiRneClient.get<string>(url, {
    timeout: constants.timeout.XXXL,
    responseType: 'arraybuffer',
  });
};

export const clientDownloadBilan = async (id: string) => {
  const encodedId = encodeURIComponent(id);
  const url = `${routes.inpi.api.rne.documents.download.bilans}${encodedId}/download`;

  return await actesApiRneClient.get<string>(url, {
    timeout: constants.timeout.XXXL,
    responseType: 'arraybuffer',
  });
};
