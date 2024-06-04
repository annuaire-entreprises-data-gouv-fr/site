import { EAdministration } from '#models/administrations/EAdministration';
import { getCarteProfessionnelleTravauxPublic } from '#models/espace-agent/carte-professionnelle-travaux-publics';
import { EScope } from '#models/user/rights';
import { verifySiren } from '#utils/helpers';
import { ProtectedAPIRoute } from '../../_helper';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  return ProtectedAPIRoute(
    'CarteProfessionnelleTravauxPublics',
    slug,
    EAdministration.DINUM,
    EScope.protectedCertificats,
    async (agentSiret: string) => {
      const siren = verifySiren(slug as string);
      return await getCarteProfessionnelleTravauxPublic(siren, agentSiret);
    }
  );
}
