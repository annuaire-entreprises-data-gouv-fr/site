import { NotASirenError, NotLuhnValidSirenError } from '#models/core/types';
import { FetchRessourceException } from '#models/exceptions';
import getImmatriculationRNE from '#models/immatriculation/rne';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { withAntiScrapping } from '#utils/server-side-helper/app/with-anti-bot';

export const GET = withAntiScrapping(async function (
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  try {
    const siren = verifySiren(slug as string);
    const immatriculation = await getImmatriculationRNE(siren);
    return Response.json(immatriculation, { status: 200 });
  } catch (e: any) {
    let message: string;
    let status = 200;
    if (e instanceof NotASirenError || e instanceof NotLuhnValidSirenError) {
      message = e.message;
      status = 400;
    } else {
      message = 'Failed to fetch RNE immatriculation';
      status = 500;
    }
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'RNEImmatriculation',
        message,
        context: {
          slug: slug as string,
        },
      })
    );
    return Response.json({ message }, { status });
  }
});
