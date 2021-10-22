import { NextApiRequest, NextApiResponse } from 'next';
import PDFDownloaderInstance from '../../../clients/inpi-site/inpi-site-pdf-downloader';
import logErrorInSentry from '../../../utils/sentry';

/**
 * Get status of a PDF download
 */

const getPdfStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const slugs = JSON.parse(req.body) as string[];
    const pdfStatuses = slugs.map((slug) => {
      return { slug, status: PDFDownloaderInstance.getStatus(slug) };
    });
    res.status(200).json(pdfStatuses);
  } catch (e: any) {
    logErrorInSentry('Error in INPI’s proxy PDF', {
      details: e.toString(),
    });

    res.status(500).end();
  }
};

export default getPdfStatus;
