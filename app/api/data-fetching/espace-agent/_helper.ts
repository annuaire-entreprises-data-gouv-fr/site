import { HttpForbiddenError } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
import { EScope, hasRights } from '#models/user/rights';
import { logFatalErrorInSentry } from '#utils/sentry';
import getSession from '#utils/server-side-helper/app/get-session';

export async function ProtectedAPIRoute<T>(
  routeLabel: string,
  slug: string,
  administration: EAdministration,
  scope: EScope,
  run: () => Promise<T>
) {
  const session = await getSession();
  try {
    if (!hasRights(session, scope)) {
      throw new HttpForbiddenError('Unauthorized account');
    }

    const data = await run();
    return Response.json(data, { status: 200 });
  } catch (e: any) {
    const message = `Failed to get donnees ${routeLabel}`;
    logFatalErrorInSentry(
      new FetchRessourceException({
        ressource: routeLabel,
        context: { slug },
        cause: e,
        message,
        administration,
      })
    );
    return Response.json({ message }, { status: e.status || 500 });
  }
}
