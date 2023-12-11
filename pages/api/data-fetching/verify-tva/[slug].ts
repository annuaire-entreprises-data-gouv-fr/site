import { NextApiRequest, NextApiResponse } from 'next';
import { FetchVerifyTVAException, buildAndVerifyTVA } from '#models/tva/verify';
import { logWarningInSentry } from '#utils/sentry';
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
    logWarningInSentry(
      new FetchVerifyTVAException({
        cause: e,
        context: { slug: slug as string },
      })
    );
    res.status(500).json({ message: 'failed to verify TVA number' });
  }
};

export default withAPM(withAntiBot(verify));
