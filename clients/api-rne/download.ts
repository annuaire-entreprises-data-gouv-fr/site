import routes from '#clients/routes';
import constants from '#models/constants';
import { actesApiRneClient } from '#utils/auth/api-rne';

export const clientDownloadActe = async (id: string) => {
  const encodedId = encodeURIComponent(id);
  const url = `${routes.inpi.api.rne.download.acte}${encodedId}/download`;
  return await actesApiRneClient.get<any>(url, {
    timeout: constants.timeout.XXXL,
    responseType: 'arraybuffer',
  });
};

export const clientDownloadBilan = async (id: string) => {
  const encodedId = encodeURIComponent(id);
  const url = `${routes.inpi.api.rne.download.bilan}${encodedId}/download`;

  return await actesApiRneClient.get<any>(url, {
    timeout: constants.timeout.XXXL,
    responseType: 'arraybuffer',
  });
};
