import { EAdministration } from '#models/administrations/EAdministration';
import { getOpqibi } from '#models/espace-agent/certificats/opqibi';
import { EScope } from '#models/user/rights';
import { verifySiren } from '#utils/helpers';
import { ProtectedAPIRoute } from '../../_helper';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  return ProtectedAPIRoute(
    'Opqibi',
    slug,
    EAdministration.DINUM,
    EScope.protectedCertificats,
    async () => {
      const siren = verifySiren(slug as string);
      return await getOpqibi(siren);
    }
  );
}
