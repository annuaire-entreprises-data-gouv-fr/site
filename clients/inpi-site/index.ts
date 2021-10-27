import PDFDownloaderInstance from '../../utils/download-manager';
import InpiSiteAuthInstance from './auth-provider';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { httpGet } from '../../utils/network/http';
import routes from '../routes';

const INPI_TIMEOUT = 30000;

export const downloadInpiPdf = async (siren: Siren): Promise<string> => {
  try {
    const cookies = await InpiSiteAuthInstance.getCookies();
    const response = await httpGet(
      `${routes.rncs.portail.entreprise}${siren}?format=pdf`,
      {
        headers: {
          Cookie: cookies || '',
        },
        responseType: 'arraybuffer',
        timeout: INPI_TIMEOUT * 2,
      }
    );
    const { data } = response;
    if (!data) {
      throw new Error('response is empty');
    }
    return data;
  } catch (e: any) {
    throw new Error('download failed');
  }
};

export const downloadInpiPdfAndSaveOnDisk = (siren: Siren) => {
  const slug = PDFDownloaderInstance.createJob(() => downloadInpiPdf(siren));
  return slug;
};

export default downloadInpiPdf;
