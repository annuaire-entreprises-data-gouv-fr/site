import { clientMatomoStats } from '#clients/matomo';
import logErrorInSentry from '#utils/sentry';

export async function GET(_request: Request) {
  try {
    const {
      visits,
      monthlyNps,
      userResponses,
      mostCopied,
      copyPasteAction,
      redirectedSiren,
    } = await clientMatomoStats();

    return Response.json(
      {
        visits,
        monthlyNps,
        userResponses,
        mostCopied,
        copyPasteAction,
        redirectedSiren,
      },
      { status: 200 }
    );
  } catch (e: any) {
    logErrorInSentry(e);
    return Response.json({ message: e.message }, { status: 500 });
  }
}
