import { EAdministration } from '#models/administrations/EAdministration';
import { getQualifelec } from '#models/espace-agent/certificats/qualifelec';
import { EScope } from '#models/user/rights';
import { verifySiret } from '#utils/helpers';
import { ProtectedAPIRoute } from '../../_helper';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  return ProtectedAPIRoute(
    'Qualifelec',
    slug,
    EAdministration.DINUM,
    EScope.protectedCertificats,
    async (agentSiret: string) => {
      const siret = verifySiret(slug as string);
      return await getQualifelec(siret, agentSiret);
    }
  );
}
