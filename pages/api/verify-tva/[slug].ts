import { NextApiRequest, NextApiResponse } from 'next';
import { tvaIntracommunautaire } from '#models/tva';
import logErrorInSentry from '#utils/sentry';
import { withAPM } from '#utils/sentry/tracing';

const verify = async (
  { query: { slug } }: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const tva = await tvaIntracommunautaire(slug as string);
    res.status(200).json({ tva });
  } catch (e: any) {
    if (Math.random() < 0.2) {
      logErrorInSentry('Error in API TVA', { details: e.toString() });
    }
    res.status(500).json({ message: 'failed to verify TVA number' });
  }
};

export default withAPM(verify);
