import { Metadata } from 'next';
import ConventionsCollectivesSection from '#components/conventions-collectives-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { getCCMetadata } from '#models/conventions-collectives';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import { cachedGetUniteLegale } from 'app/(header-default)/cached-methods';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, page, isBot } = extractParamsAppRouter(props);

  const session = await getSession();
  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);

  return {
    title: `Conventions collectives - ${uniteLegalePageTitle(
      uniteLegale,
      session
    )}`,
    description: uniteLegalePageDescription(uniteLegale, session),
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/divers/${uniteLegale.siren}`,
    },
  };
};

export default async function ConventionCollectivePage(props: AppRouterProps) {
  const session = await getSession();
  const { slug, page, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);

  const ccWithMetadata = await getCCMetadata(
    uniteLegale.conventionsCollectives
  );

  return (
    <>
      <Title
        ficheType={FICHE.DIVERS}
        uniteLegale={uniteLegale}
        session={session}
      />
      <ConventionsCollectivesSection ccWithMetadata={ccWithMetadata} />
    </>
  );
}
