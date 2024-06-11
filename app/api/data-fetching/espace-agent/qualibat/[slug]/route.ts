import { EAdministration } from '#models/administrations/EAdministration';
import { getQualibat } from '#models/espace-agent/certificats/qualibat';
import { EScope } from '#models/user/rights';
import { verifySiret } from '#utils/helpers';
import { ProtectedAPIRoute } from '../../_helper';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  return ProtectedAPIRoute(
    'Qualibat',
    slug,
    EAdministration.DINUM,
    EScope.protectedCertificats,
    async () => {
      const siret = verifySiret(slug as string);
      return await getQualibat(siret);
    }
  );
}
