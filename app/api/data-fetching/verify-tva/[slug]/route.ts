import { EAdministration } from '#models/administrations/EAdministration';
import { APINotRespondingFactory } from '#models/api-not-responding';
import { FetchVerifyTVAException, buildAndVerifyTVA } from '#models/tva/verify';
import { logWarningInSentry } from '#utils/sentry';
import { withIgnoreBot } from '#utils/server-side-helper/app/with-anti-bot';

export const GET = withIgnoreBot(async function (
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  try {
    const tva = await buildAndVerifyTVA(slug);
    return Response.json({ tva }, { status: 200 });
  } catch (e: any) {
    logWarningInSentry(
      new FetchVerifyTVAException({
        cause: e,
        context: { slug: slug as string },
      })
    );
    return Response.json(
      { message: 'failed to verify TVA number' },
      { status: 500 }
    );
  }
},
APINotRespondingFactory(EAdministration.VIES, 418));
