import { NextApiRequest, NextApiResponse } from 'next';
import { HttpNotFound } from '../../../../clients/exceptions';
import PDFDownloaderInstance from '../../../../clients/inpi-site/downloader-manager';
import { isCaptchaCookieValid } from '../../../../utils/captcha';
import randomId from '../../../../utils/helpers/randomId';
import { isSiren } from '../../../../utils/helpers/siren-and-siret';
import redirect from '../../../../utils/redirects';
import logErrorInSentry from '../../../../utils/sentry';

/**
 * Call with authenticated cookies to get full pdf.
 */

const createPdfDownload = async (req: NextApiRequest, res: NextApiResponse) => {
  const siren = req.query.slug as string;

  if (!isSiren(siren)) {
    throw new HttpNotFound(404, `${siren} is not a valid siren`);
  }

  const captchaCookieIsValid = isCaptchaCookieValid(req, res);
  if (!captchaCookieIsValid) {
    redirect(res, `/captcha?url=${req.url}`);
    return;
  }

  try {
    const slug = randomId();
    PDFDownloaderInstance.downloadAndSaveOnDisk(siren, slug);
    res.status(201).json({ slug });
  } catch (e: any) {
    logErrorInSentry('Error in INPI’s proxy PDF', {
      siren,
      details: e.toString(),
    });

    res.status(500).end();
  }
};

export default createPdfDownload;
