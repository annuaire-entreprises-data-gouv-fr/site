import fs from 'fs';

import logErrorInSentry from '../../utils/sentry';
import randomId from '../helpers/randomId';

/**
 * INPI Pdf generation can be very slow
 */
const DIRECTORY = process.env.INPI_PDF_DOWNLOAD_DIRECTORY as string;
const MAX_RETRY_COUNT = 3;
const FILES_LIFESPAN = 30 * 60 * 1000;
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

const pendingDownloads: { [key: string]: { retry: number } } = {};

class PDFDownloader {
  _initialized = false;

  constructor() {
    if (!DIRECTORY) {
      throw new Error('Download manager : directory is not defined');
    }

    this.cleanOldFiles();
  }

  async init() {
    if (!fs.existsSync(DIRECTORY)) {
      await fs.promises.mkdir(DIRECTORY, { recursive: true });
    }

    this._initialized = true;
  }

  createJob(downloadCallBack: () => Promise<string>) {
    const downloadJobId = randomId();
    this.downloadAndRetry(downloadJobId, downloadCallBack);
    return downloadJobId;
  }

  async downloadAndRetry(
    slug: string,
    downloadCallBack: () => Promise<string>
  ) {
    if (!this._initialized) {
      await this.init();
    }

    this.addOrUpdatePendingDownload(slug);

    try {
      const file = await downloadCallBack();
      await this.savePdfOnDisk(slug, file);
      this.removePendingDownload(slug);
    } catch (e: any) {
      const downloadEntry = pendingDownloads[slug];
      const shouldRetry =
        downloadEntry && downloadEntry.retry < MAX_RETRY_COUNT;

      if (shouldRetry) {
        this.downloadAndRetry(slug, downloadCallBack);
      } else {
        logErrorInSentry('Download manager : download failed', {
          details: e.toString(),
        });
        this.removePendingDownload(slug);
      }
    }
  }

  addOrUpdatePendingDownload(slug: string) {
    if (pendingDownloads[slug]) {
      pendingDownloads[slug].retry += 1;
    } else {
      pendingDownloads[slug] = { retry: 0 };
    }
  }

  removePendingDownload(slug: string) {
    delete pendingDownloads[slug];
  }

  async savePdfOnDisk(slug: string, pdf: any) {
    await fs.promises.writeFile(`${DIRECTORY}${slug}.pdf`, pdf, {});
  }

  getDownloadStatus(slug: string): IStatusMetaData {
    const fileMetaData = pendingDownloads[slug];
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
    const now = new Date().getTime();
    try {
      const files = await fs.promises.readdir(DIRECTORY);
      await Promise.all(
        files.map(async (file) => {
          const filePath = `${DIRECTORY}${file}`;
          const stats = await fs.promises.stat(filePath);
          const isTooOld = now - stats.birthtimeMs > FILES_LIFESPAN;
          if (isTooOld) {
            await fs.promises.unlink(filePath);
          }
        })
      );
    } catch (e: any) {
      logErrorInSentry('Download manager : file cleaning failed', {
        details: e.toString(),
      });
    }
    setTimeout(this.cleanOldFiles, FILES_CLEANING_FREQUENCY);
  };
}

const pdfDownloader = new PDFDownloader();

export default pdfDownloader;
