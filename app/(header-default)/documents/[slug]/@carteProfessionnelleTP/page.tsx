import { CarteProfessionnelleTravauxPublicsSection } from '#components/carte-professionnelle-travaux-publics-section';
import { isAPI404 } from '#models/api-not-responding';
import { getCarteProfessionnelleTravauxPublic } from '#models/espace-agent/carte-professionnelle-travaux-publics';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';

export default async function Page(props: AppRouterProps) {
  const session = await getSession();
  const { slug, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  const carteProfessionnelleTravauxPublics =
    await getCarteProfessionnelleTravauxPublic(
      uniteLegale.siren,
      session?.user
    );
  if (isAPI404(carteProfessionnelleTravauxPublics)) {
    return null;
  }

  return (
    <CarteProfessionnelleTravauxPublicsSection
      carteProfessionnelleTravauxPublics={carteProfessionnelleTravauxPublics}
    />
  );
}
