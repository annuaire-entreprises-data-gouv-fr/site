import { clientDocuments } from '#clients/api-proxy/rne/documents';
import { HttpForbiddenError, HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import getSession from '#utils/server-side-helper/app/get-session';
import { isAgent } from '#utils/session';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getSession();
  const slug = params.slug;
  try {
    if (!isAgent(session)) {
      throw new HttpForbiddenError('Unauthorized account');
    }

    const siren = verifySiren(slug as string);

    const actes = await clientDocuments(siren);
    actes.hasBilanConsolide =
      actes.bilans.filter((b) => b.typeBilan === 'K').length > 0;

    return Response.json(actes, { status: 200 });
  } catch (e: any) {
    const message = 'Failed to fetch document list';

    if (!(e instanceof HttpNotFound)) {
      logErrorInSentry(
        new FetchRessourceException({
          cause: e,
          ressource: 'RNEDocuments',
          message,
          administration: EAdministration.INPI,
          context: { siren: slug as string },
        })
      );
    }
    return Response.json({ message }, { status: e.status || 500 });
  }
}
