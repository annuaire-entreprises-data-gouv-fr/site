import { NextApiRequest, NextApiResponse } from 'next';
import { HttpNotFound } from '../../../../clients/exceptions';
import APIRncsProxyClient from '../../../../clients/rncs/rncs-proxy-client';
import routes from '../../../../clients/routes';
import { isSiren } from '../../../../utils/helpers/siren-and-siret';
import logErrorInSentry from '../../../../utils/sentry';

/**
 * Call with authenticated cookies to get full pdf.
 */

const createPdfDownload = async (req: NextApiRequest, res: NextApiResponse) => {
  const siren = req.query.slug as string;

  if (!isSiren(siren)) {
    throw new HttpNotFound(`${siren} is not a valid siren`);
  }

  try {
    const response = await APIRncsProxyClient({
      url: routes.rncs.proxy.document.justificatif.createJob + siren,
    });

    res.status(201).json({ slug: response.data });
  } catch (e: any) {
    logErrorInSentry('Error in INPI’s PDF job creation', {
      siren,
      details: e.toString(),
    });

    res.status(500).end();
  }
};

export default createPdfDownload;
