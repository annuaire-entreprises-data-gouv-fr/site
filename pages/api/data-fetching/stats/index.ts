import { NextApiRequest, NextApiResponse } from 'next';
import logErrorInSentry from '#utils/sentry';
import { clientMatomoStats } from '#clients/matomo';

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
    logErrorInSentry('failed to compute stats (API route)', {
      details: e.toString(),
    });
    res.status(500).json({ message: 'failed to compute stats' });
  }
};

export default stats;
