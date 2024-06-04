import { getImmatriculationRNE } from '#models/immatriculation/rne';
import { verifySiren } from '#utils/helpers';
import { withIgnoreBot } from '#utils/server-side-helper/app/with-anti-bot';

export const GET = withIgnoreBot(async function (
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  try {
    const siren = verifySiren(slug);
    const immatriculation = await getImmatriculationRNE(siren);
    return Response.json(immatriculation, { status: 200 });
  } catch (e: any) {
    return Response.json(
      { message: 'failed to fetch RNEImmatriculation' },
      { status: 500 }
    );
  }
});
