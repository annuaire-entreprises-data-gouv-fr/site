import { clientDocuments } from '#clients/api-proxy/rne/documents';
import { EAdministration } from '#models/administrations/EAdministration';
import { EScope } from '#models/user/rights';
import { verifySiren } from '#utils/helpers';
import { ProtectedAPIRoute } from '../../_helper';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  return ProtectedAPIRoute(
    'RNEDocuments',
    slug,
    EAdministration.INPI,
    EScope.documentsRne,
    async () => {
      const siren = verifySiren(slug as string);

      const actes = await clientDocuments(siren);
      actes.hasBilanConsolide =
        actes.bilans.filter((b) => b.typeBilan === 'K').length > 0;
      return actes;
    }
  );
}
