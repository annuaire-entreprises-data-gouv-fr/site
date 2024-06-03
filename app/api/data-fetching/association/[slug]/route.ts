import { EAdministration } from '#models/administrations/EAdministration';
import { getAssociationFromSlug } from '#models/association';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { withIgnoreBot } from '#utils/server-side-helper/app/with-anti-bot';

export const GET = withIgnoreBot(async function (
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  try {
    const immatriculation = await getAssociationFromSlug(slug as string);
    return Response.json(immatriculation, { status: 200 });
  } catch (e: any) {
    const message = 'Failed to fetch Association';

    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'Association',
        administration: EAdministration.DJEPVA,
        context: {
          slug: slug as string,
        },
      })
    );
    return Response.json({ message }, { status: e.status || 500 });
  }
});
