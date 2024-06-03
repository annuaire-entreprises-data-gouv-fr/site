import { EAdministration } from '#models/administrations/EAdministration';
import { getConformiteEntreprise } from '#models/espace-agent/conformite';
import { EScope } from '#models/user/rights';
import { extractSirenFromSiret, verifySiret } from '#utils/helpers';
import { ProtectedAPIRoute } from '../../_helper';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  return ProtectedAPIRoute(
    'DonneesConformite',
    slug,
    EAdministration.DINUM,
    EScope.conformite,
    async (agentSiret: string) => {
      const siret = verifySiret(slug as string);
      const siren = extractSirenFromSiret(siret);

      return await getConformiteEntreprise(siren, siret, agentSiret);
    }
  );
}
