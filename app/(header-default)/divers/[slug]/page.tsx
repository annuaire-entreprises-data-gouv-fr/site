import { Metadata } from 'next';
import { cache } from 'react';
import ConventionsCollectivesSection from '#components/conventions-collectives-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { getCCMetadata } from '#models/conventions-collectives-list';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import withErrorHandler from '#utils/server-side-helper/app/with-error-handler';

const cachedGetUniteLegale = cache(
  async (slug: string, page: number, isBot: boolean) => {
    const uniteLegale = await getUniteLegaleFromSlug(slug, {
      page,
      isBot,
    });
    return uniteLegale;
  }
);

export const generateMetadata = withErrorHandler(
  async (props: AppRouterProps): Promise<Metadata> => {
    const { slug, page, isBot } = extractParamsAppRouter(props);

    const session = await getSession();
    const uniteLegale = await cachedGetUniteLegale(slug, page, isBot);

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
  }
);

export default withErrorHandler(async function ConventionCollectivePage(
  props: AppRouterProps
) {
  const session = await getSession();
  const { slug, page, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, page, isBot);

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
});
