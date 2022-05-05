import { NextApiRequest, NextApiResponse } from 'next';
import { HttpNotFound } from '../../../clients/exceptions';
import { APIRncsProxyGet } from '../../../clients/rncs/rncs-proxy-client';
import routes from '../../../clients/routes';
import constants from '../../../models/constants';
import { isSiren } from '../../../utils/helpers/siren-and-siret';
import logErrorInSentry from '../../../utils/sentry';

/**
 * Download a pdf directly without storing it locally
 */

const downloadPdf = async (req: NextApiRequest, res: NextApiResponse) => {
  const siren = req.query.slug as string;

  if (!isSiren(siren)) {
    throw new HttpNotFound(`${siren} is not a valid siren`);
  }

  try {
    const url = routes.rncs.proxy.document.justificatif.directDownload + siren;
    const data = await APIRncsProxyGet(url, {
      timeout: constants.timeout.pdf,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=justificatif_immatriculation_rcs_${siren}.pdf`
    );
    res.status(200).send(data);
  } catch (e: any) {
    logErrorInSentry('Error in INPI’s PDF Direct Download', {
      siren,
      details: e.toString(),
    });

    res.writeHead(302, {
      Location: '/erreur/administration/inpi',
    });

    res.end();
  }
};

export default downloadPdf;
