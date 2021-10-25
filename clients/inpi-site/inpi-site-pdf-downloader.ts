import fs from 'fs';

import { Siren } from '../../utils/helpers/siren-and-siret';
import { httpGet } from '../../utils/network/http';
import logErrorInSentry from '../../utils/sentry';
import routes from '../routes';
import InpiSiteAuthInstance from './inpi-site-auth';

/**
 * INPI Pdf generation can be very slow
 */
const INPI_TIMEOUT = 30000;
const DIRECTORY = process.env.INPI_PDF_DOWNLOAD_DIRECTORY as string;

const pendingDownload: { [key: string]: { retry: number } } = {};
class PDFDownloader {
  constructor() {
    if (!DIRECTORY) {
      throw new Error('INPI download directory is not defined');
    }
    if (!fs.existsSync(DIRECTORY)) {
      fs.mkdirSync(DIRECTORY);
    }
  }

  async download(siren: Siren) {
    const cookies = await InpiSiteAuthInstance.getAuthenticatedCookies();
    console.log('cookies : ' + cookies);
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
    return response.data;
  }

  async downloadAndSaveOnDisk(siren: Siren, slug: string) {
    try {
      pendingDownload[slug] = { retry: 0 };

      console.log('Keys :');
      console.log(Object.keys(pendingDownload));

      const pdf = await this.download(siren);
      fs.writeFileSync(`${DIRECTORY}${slug}.pdf`, pdf, {});
      console.log('deleting');
      delete pendingDownload[slug];
    } catch (e: any) {
      logErrorInSentry('INPI PDF Download failed', {
        siren,
        details: e.toString(),
      });
      delete pendingDownload[slug];
    }
  }

  getStatus(slug: string) {
    const fileMetaData = pendingDownload[slug];
    console.log('status : ' + JSON.stringify(fileMetaData));
    if (fileMetaData && fileMetaData.retry === 0) {
      return 'pending';
    } else if (fileMetaData && fileMetaData.retry > 0) {
      return 'retried';
    }
    if (fs.existsSync(`${DIRECTORY}${slug}.pdf`)) {
      return 'downloaded';
    }
    return 'aborted';
  }
}

/**
 * Create a singleton
 */
const PDFDownloaderInstance = new PDFDownloader();

export default PDFDownloaderInstance;
