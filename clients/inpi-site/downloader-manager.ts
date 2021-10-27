import fs from 'fs';

import { Siren } from '../../utils/helpers/siren-and-siret';
import { httpGet } from '../../utils/network/http';
import logErrorInSentry from '../../utils/sentry';
import routes from '../routes';
import InpiSiteAuthInstance from './auth-provider';

/**
 * INPI Pdf generation can be very slow
 */
const INPI_TIMEOUT = 30000;
const DIRECTORY = process.env.INPI_PDF_DOWNLOAD_DIRECTORY as string;
const RETRY_COUNT = 3;
const FILES_LIFESPAN = 60 * 60 * 1000;
const FILES_CLEANING_FREQUENCY = 60 * 60 * 1000;

interface IStatusMetaData {
  status: string;
  label: string;
  isPending: boolean;
}

const STATUSES: { [key: string]: IStatusMetaData } = {
  pending: {
    status: 'pending',
    label: 'Téléchargement en cours',
    isPending: true,
  },
  retried: {
    status: 'retried',
    label:
      'Le téléchargement prend plus de temps que prévu. Merci de patienter.',
    isPending: true,
  },
  aborted: {
    status: 'aborted',
    label: 'Le téléchargement a échoué',
    isPending: false,
  },
  downloaded: {
    status: 'downloaded',
    label: 'Téléchargement réussi',
    isPending: false,
  },
};

const pendingDownload: { [key: string]: { retry: number } } = {};
class PDFDownloader {
  constructor() {
    if (!DIRECTORY) {
      throw new Error('INPI download directory is not defined');
    }
    if (!fs.existsSync(DIRECTORY)) {
      fs.mkdirSync(DIRECTORY);
    }
    this.cleanOldFiles();
  }

  async download(siren: Siren, slug?: string, retry = false) {
    try {
      const cookies = await InpiSiteAuthInstance.getAuthenticatedCookies();
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
      console.log('retry');
      if (
        retry &&
        slug &&
        pendingDownload[slug] &&
        pendingDownload[slug].retry < RETRY_COUNT
      ) {
        pendingDownload[slug].retry += 1;
        this.downloadAndSaveOnDisk(siren, slug);
      } else {
        throw new Error('download failed');
      }
    }
  }

  async downloadAndSaveOnDisk(siren: Siren, slug: string) {
    pendingDownload[slug] = { retry: 0 };

    try {
      const pdf = await this.download(siren, slug, true);

      console.log('saving file');
      fs.writeFileSync(`${DIRECTORY}${slug}.pdf`, pdf, {});
      delete pendingDownload[slug];
    } catch (e: any) {
      logErrorInSentry('INPI PDF Download failed', {
        siren,
        details: e.toString(),
      });
      delete pendingDownload[slug];
    }
  }

  getDownloadStatus(slug: string): IStatusMetaData {
    const fileMetaData = pendingDownload[slug];
    if (fileMetaData && fileMetaData.retry === 0) {
      return STATUSES.pending;
    } else if (fileMetaData && fileMetaData.retry > 0) {
      return STATUSES.retried;
    }
    if (fs.existsSync(`${DIRECTORY}${slug}.pdf`)) {
      return STATUSES.downloaded;
    }
    return STATUSES.aborted;
  }

  cleanOldFiles = async () => {
    console.log('cleaning');
    try {
      const now = new Date().getTime();
      // get all files
      fs.readdirSync(DIRECTORY).forEach((file) => {
        const filePath = `${DIRECTORY}${file}`;
        const stats = fs.statSync(filePath);
        const isTooOld = now - stats.birthtimeMs > FILES_LIFESPAN;
        if (isTooOld) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (e: any) {
      logErrorInSentry('INPI PDF cleaning failed', { details: e.toString() });
    }

    setTimeout(this.cleanOldFiles, FILES_CLEANING_FREQUENCY);
  };
}

/**
 * Create a singleton
 */
const PDFDownloaderInstance = new PDFDownloader();

export default PDFDownloaderInstance;
