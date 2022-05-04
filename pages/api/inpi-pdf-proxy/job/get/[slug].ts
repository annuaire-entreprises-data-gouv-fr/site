import { NextApiRequest, NextApiResponse } from 'next';
import routes from '../../../../../clients/routes';

/**
 * Call with authenticated cookies to get full pdf.
 */

const getPdfDownload = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug as string;

  res.redirect(routes.rncs.proxy.document.justificatif.get + slug + '.pdf');
};

export default getPdfDownload;
