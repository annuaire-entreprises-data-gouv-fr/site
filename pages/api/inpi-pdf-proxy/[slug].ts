import { NextApiRequest, NextApiResponse } from 'next';
import { HttpNotFound } from '../../../clients/exceptions';
import routes from '../../../clients/routes';
import { isSiren } from '../../../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../../../utils/sentry';

/**
 * Download a pdf directly without storing it locally
 */

const downloadPdf = async (req: NextApiRequest, res: NextApiResponse) => {
  const siren = req.query.slug as string;

  if (!isSiren(siren)) {
    throw new HttpNotFound(`${siren} is not a valid siren`);
  }

  res.redirect(routes.rncs.portail.entreprise + siren + '.pdf');
  logWarningInSentry('Direct pdf download - redirected', { siren });
};

export default downloadPdf;
