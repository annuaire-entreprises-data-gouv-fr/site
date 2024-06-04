import { EAdministration } from '#models/administrations/EAdministration';
import { getMandatairesRCS } from '#models/espace-agent/mandataires-rcs';
import { EScope } from '#models/user/rights';
import { verifySiren } from '#utils/helpers';
import { ProtectedAPIRoute } from '../../_helper';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  return ProtectedAPIRoute(
    'RCSMandataires',
    slug,
    EAdministration.INFOGREFFE,
    EScope.documentsRne,
    async () => {
      const siren = verifySiren(slug as string);
      return getMandatairesRCS(siren);
    }
  );
}
