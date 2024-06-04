import { EAdministration } from '#models/administrations/EAdministration';
import { getCarteProfessionnelleTravauxPublic } from '#models/espace-agent/carte-professionnelle-travaux-publics';
import { EScope } from '#models/user/rights';
import { Siret, extractSirenFromSiret, verifySiret } from '#utils/helpers';
import { ProtectedAPIRoute } from '../../_helper';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  return ProtectedAPIRoute(
    'CarteProfessionnelleTravauxPublics',
    slug,
    EAdministration.FNTP,
    EScope.carteProfessionnelleTravauxPublics,
    async (agentSiret: string) => {
      const siret = verifySiret(slug as string);
      const siren = extractSirenFromSiret(siret);

      return await getCarteProfessionnelleTravauxPublic(
        siren,
        agentSiret as Siret
      );
    }
  );
}
