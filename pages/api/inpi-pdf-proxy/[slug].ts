import { NextApiRequest, NextApiResponse } from 'next';
import { HttpNotFound } from '../../../clients/exceptions';
import routes from '../../../clients/routes';
import { isCaptchaCookieValid } from '../../../utils/captcha';
import { isSiren } from '../../../utils/helpers/siren-and-siret';
import { httpGet } from '../../../utils/network/http';
import redirect from '../../../utils/redirects';
import logErrorInSentry, { logWarningInSentry } from '../../../utils/sentry';
import PDFDownloader from './pdf-downloader';

/**
 * Call with authenticated cookies to get full pdf.
 */

const downloadManager = new PDFDownloader();

const proxyPdf = async (req: NextApiRequest, res: NextApiResponse) => {
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
    const data = await downloadManager.startDownload(siren);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=justificatif_immatriculation_rcs_${siren}.pdf`
    );

    res.status(200).send(data);
  } catch (e: any) {
    logErrorInSentry('Error in INPI’s proxy PDF', {
      siren,
      details: e.toString(),
    });

    res.writeHead(302, {
      Location: '/erreur/administration/inpi',
    });

    res.end();
  }
};

export default proxyPdf;
