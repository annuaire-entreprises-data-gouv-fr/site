import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageLoader } from '#components/page-loader';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { getServicePublicByUniteLegale } from '#models/service-public';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import ResponsableSection from 'app/(header-default)/dirigeants/_component/sections/responsables-service-public';
import { DirigeantInformation } from '../_component/sections';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, page, isBot } = extractParamsAppRouter(props);

  const session = await getSession();
  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);

  return {
    title: `Dirigeants de la structure - ${uniteLegalePageTitle(
      uniteLegale,
      session
    )}`,
    description: uniteLegalePageDescription(uniteLegale, session),
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/dirigeants/${uniteLegale.siren}`,
    },
  };
};

const DirigeantsPage = async (props: AppRouterProps) => {
  const { slug, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);
  const servicePublic = await getServicePublicByUniteLegale(uniteLegale, {
    isBot,
  });

  const session = await getSession();

  return (
    <>
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.DIRIGEANTS}
          session={session}
        />
        {servicePublic ? (
          <ResponsableSection servicePublic={servicePublic} />
        ) : (
          <Suspense fallback={<PageLoader />}>
            <DirigeantInformation uniteLegale={uniteLegale} session={session} />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default DirigeantsPage;
