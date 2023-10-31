import { NextApiRequest, NextApiResponse } from 'next';
import { clientMatomoStats } from '#clients/matomo';
import logErrorInSentry from '#utils/sentry';

const stats = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      visits,
      monthlyNps,
      userResponses,
      mostCopied,
      copyPasteAction,
      redirectedSiren,
    } = await clientMatomoStats();

    res.status(200).json({
      visits,
      monthlyNps,
      userResponses,
      mostCopied,
      copyPasteAction,
      redirectedSiren,
    });
  } catch (e: any) {
    logErrorInSentry(e, {
      errorName: 'failed to compute stats (API route)',
    });
    res.status(500).json({ message: 'failed to compute stats' });
  }
};

export default stats;
