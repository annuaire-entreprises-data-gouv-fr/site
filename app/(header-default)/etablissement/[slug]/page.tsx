import { Metadata } from 'next';
import { NonDiffusibleSection } from '#components/non-diffusible-section';
import ServicePublicSection from '#components/service-public-section';
import { TitleEtablissementWithDenomination } from '#components/title-section/etablissement';
import { estNonDiffusible } from '#models/core/statut-diffusion';
import { getServicePublicByEtablissement } from '#models/service-public';
import {
  etablissementPageDescription,
  etablissementPageTitle,
  shouldNotIndex,
} from '#utils/helpers';
import { cachedEtablissementWithUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import EtablissementSection from 'components/etablissement-section';
import MatomoEventRedirected from 'components/matomo-event/search-redirected';

export const generateMetadata = async function (
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
};

export default (async function EtablissementPage(props: AppRouterProps) {
  const { slug, isBot, isRedirected } = extractParamsAppRouter(props);
  const { etablissement, uniteLegale } =
    await cachedEtablissementWithUniteLegale(slug, isBot);

  const session = await getSession();
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
