import pdfDownloader from '../../utils/download-manager';
import inpiSiteAuth from './auth-provider';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { httpGet } from '../../utils/network';
import routes from '../routes';

const INPI_TIMEOUT = 50 * 1000;

export const downloadInpiPdf = async (siren: Siren): Promise<string> => {
  try {
    const cookies = await inpiSiteAuth.getCookies();
    const response = await httpGet(
      `${routes.rncs.portail.entreprise}${siren}?format=pdf`,
      {
        headers: {
          Cookie: cookies || '',
        },
        responseType: 'arraybuffer',
        timeout: INPI_TIMEOUT,
      }
    );
    const { data } = response;
    if (!data) {
      throw new Error('response is empty');
    }
    return data;
  } catch (e: any) {
    throw new Error('download failed' + e);
  }
};

export const downloadInpiPdfAndSaveOnDisk = (siren: Siren) => {
  const downloadJobId = pdfDownloader.createJob(() => downloadInpiPdf(siren));
  return downloadJobId;
};

export default downloadInpiPdf;
