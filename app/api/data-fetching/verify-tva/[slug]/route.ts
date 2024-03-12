import { tvaNumber } from '#models/tva/utils';
import { FetchVerifyTVAException, buildAndVerifyTVA } from '#models/tva/verify';
import { Siren } from '#utils/helpers';
import { logWarningInSentry } from '#utils/sentry';
import { withIgnoreBot } from '#utils/server-side-helper/app/with-anti-bot';

/**
 * Simplmified response for bots, doesnot really check TVA
 * @param param0
 * @returns
 */
const fallbackForBot = ({ params }: { params: { slug: string } }) => {
  return { tva: tvaNumber(params.slug as Siren) };
};

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
fallbackForBot);
