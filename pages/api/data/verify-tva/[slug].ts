import { NextApiRequest, NextApiResponse } from 'next';
import { tvaIntracommunautaire } from '#models/tva';
import logErrorInSentry from '#utils/sentry';
import { withAPM } from '#utils/sentry/tracing';
import withAntiBot from '#utils/session/with-anti-bot';

const verify = async (
  { query: { slug } }: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const tva = await tvaIntracommunautaire(slug as string);
    res.status(200).json({ tva });
  } catch (e: any) {
    logErrorInSentry('Error in API TVA', { details: e.toString() });
    res.status(500).json({ message: 'failed to verify TVA number' });
  }
};

export default withAPM(withAntiBot(verify));
