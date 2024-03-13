import { Metadata } from 'next';
import { cache } from 'react';
import { NonDiffusibleSection } from '#components/non-diffusible-section';
import ServicePublicSection from '#components/service-public-section';
import { TitleEtablissementWithDenomination } from '#components/title-section/etablissement';
import { getEtablissementWithUniteLegaleFromSlug } from '#models/core/etablissement';
import { estNonDiffusible } from '#models/core/statut-diffusion';
import { getServicePublicByEtablissement } from '#models/service-public';
import {
  etablissementPageDescription,
  etablissementPageTitle,
  extractSirenOrSiretSlugFromUrl,
  shouldNotIndex,
} from '#utils/helpers';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import withErrorHandler from '#utils/server-side-helper/app/with-error-handler';
import EtablissementSection from 'components/etablissement-section';
import MatomoEventRedirected from 'components/matomo-event/search-redirected';

const cachedEtablissementWithUniteLegale = cache(
  async (slug: string, isBot: boolean) => {
    const siretSlug = extractSirenOrSiretSlugFromUrl(slug);
    const uniteLegale = await getEtablissementWithUniteLegaleFromSlug(
      siretSlug,
      isBot
    );
    return uniteLegale;
  }
);

export const generateMetadata = withErrorHandler(async function (
  props: AppRouterProps
): Promise<Metadata> {
  const { slug, isBot } = extractParamsAppRouter(props);
  const { uniteLegale, etablissement } =
    await cachedEtablissementWithUniteLegale(slug, isBot);

  const title = `${
    etablissement.estSiege ? 'Siège social' : 'Etablissement secondaire'
  } - ${etablissementPageTitle(etablissement, uniteLegale, null)}`;

  return {
    title,
    description: etablissementPageDescription(etablissement, uniteLegale, null),
    robots: shouldNotIndex(uniteLegale) ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/etablissement/${etablissement.siret}`,
    },
  };
});

export default withErrorHandler(async function EtablissementPage(
  props: AppRouterProps
) {
  // post server side props ? et session ?
  const session = await getSession();

  const { slug, isBot, isRedirected } = extractParamsAppRouter(props);

  const { etablissement, uniteLegale } =
    await cachedEtablissementWithUniteLegale(slug, isBot);

  const servicePublic = await getServicePublicByEtablissement(
    uniteLegale,
    etablissement,
    { isBot }
  );

  return (
    <>
      {isRedirected && (
        <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />
      )}
      <div className="content-container">
        <TitleEtablissementWithDenomination
          uniteLegale={uniteLegale}
          etablissement={etablissement}
          session={session}
        />
        <br />
        {estNonDiffusible(etablissement) ? (
          <NonDiffusibleSection />
        ) : (
          <EtablissementSection
            etablissement={etablissement}
            uniteLegale={uniteLegale}
            session={session}
            withDenomination={true}
            usedInEntreprisePage={false}
          />
        )}
        {servicePublic && (
          <ServicePublicSection
            servicePublic={servicePublic}
            uniteLegale={uniteLegale}
          />
        )}
      </div>
    </>
  );
});
