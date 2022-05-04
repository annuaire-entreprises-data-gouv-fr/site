import { NextApiRequest, NextApiResponse } from 'next';
import { HttpNotFound } from '../../../../clients/exceptions';
import { downloadInpiPdfAndSaveOnDisk } from '../../../../clients/inpi-site/pdf-immatriculation';
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
    const slug = downloadInpiPdfAndSaveOnDisk(siren);
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
