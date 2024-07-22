import { Metadata } from 'next';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { getNomComplet } from '#models/core/statut-diffusion';
import { uniteLegalePageDescription } from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import ElusSection from 'app/(header-default)/elus/_component/section/elus-section';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, page, isBot } = extractParamsAppRouter(props);

  const session = await getSession();
  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);

  return {
    title: `Élus de ${getNomComplet(uniteLegale, session)} - ${
      uniteLegale.siren
    }`,
    description: uniteLegalePageDescription(uniteLegale, session),
    robots: 'noindex',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/elus/${uniteLegale.siren}`,
    },
  };
};

const ElusPage = async (props: AppRouterProps) => {
  const { slug, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);
  const session = await getSession();

  return (
    <div className="content-container">
      <Title
        uniteLegale={uniteLegale}
        ficheType={FICHE.ELUS}
        session={session}
      />
      <ElusSection uniteLegale={uniteLegale} />
    </div>
  );
};

export default ElusPage;
