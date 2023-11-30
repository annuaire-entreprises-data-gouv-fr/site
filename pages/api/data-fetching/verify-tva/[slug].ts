import { NextApiRequest, NextApiResponse } from 'next';
import { buildAndVerifyTVA } from '#models/tva/verify';
import logErrorInSentry from '#utils/sentry';
import { withAPM } from '#utils/sentry/tracing';
import withAntiBot from '#utils/session/with-anti-bot';

const verify = async (
  { query: { slug } }: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const tva = await buildAndVerifyTVA(slug as string);
    res.status(200).json({ tva });
  } catch (e: any) {
    logErrorInSentry(e, { errorName: 'Error in API TVA' });
    res.status(500).json({ message: 'failed to verify TVA number' });
  }
};

export default withAPM(withAntiBot(verify));
