import { NextApiRequest, NextApiResponse } from 'next';
import APIRncsProxyClient from '../../../../clients/rncs/rncs-proxy-client';
import routes from '../../../../clients/routes';
import logErrorInSentry from '../../../../utils/sentry';

/**
 * Get status of a PDF download
 */

const getPdfStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const statuses = await APIRncsProxyClient({
      url: routes.rncs.proxy.document.justificatif.status,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: req.body,
    });

    res.status(200).json(statuses.data);
  } catch (e: any) {
    logErrorInSentry('Error in INPI’s PDF job status', {
      details: e.toString(),
    });

    res.status(500).json({ error: e });
  }
};

export default getPdfStatus;
