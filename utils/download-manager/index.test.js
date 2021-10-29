import { PDFDownloader } from '../download-manager';
import fileSystemMockup from '../file-system/mockup';

describe('Init', () => {
  test('Fails if no directory is provided', () => {
    const pdfDownloader = new PDFDownloader(fileSystemMockup, '', false);
    expect(pdfDownloader.init()).rejects.toThrow(Error);
    expect(pdfDownloader._initialized).toBe(false);
  });
  test('Succeed if a directory is provided', () => {
    const pdfDownloader = new PDFDownloader(fileSystemMockup, '/tmp', false);
    expect(pdfDownloader.init()).resolves.toBe(undefined);
    expect(pdfDownloader._initialized).toBe(true);
  });
});

describe('CreateJob', () => {
  const pdfDownloader = new PDFDownloader(fileSystemMockup, '/tmp', false);

  test('Returns JobId', async () => {
    await pdfDownloader.init();

    const jobId = pdfDownloader.createJob(
      () => new Promise((resolve) => resolve('mon-téléchargement'))
    );
    expect(jobId).toBeDefined();
  });
});

describe('getDownloadStatus', () => {
  test('status pending', async () => {
    const pdfDownloader = new PDFDownloader(fileSystemMockup, '/tmp', false);
    await pdfDownloader.init();
    const jobId = pdfDownloader.createJob(
      () => new Promise((resolve) => resolve('mon-téléchargement'))
    );
    const status = pdfDownloader.getDownloadStatus(jobId);
    expect(status.status).toBe('pending');
  });
  test('status downloaded', async () => {
    const pdfDownloader = new PDFDownloader(fileSystemMockup, '/tmp', false);
    await pdfDownloader.init();
    const jobId = pdfDownloader.createJob(
      () => new Promise((resolve) => resolve('mon-téléchargement'))
    );
    pdfDownloader.removePendingDownload(jobId);
    const status = pdfDownloader.getDownloadStatus(jobId);
    expect(status.status).toBe('downloaded');
  });
});

export {};
