import EtablissementSection from "components/etablissement-section";
import MatomoEventRedirected from "components/matomo-event/search-redirected";
import type { Metadata } from "next";
import { NonDiffusibleStrictSection } from "#components/non-diffusible-section";
import ServicePublicSection from "#components/service-public-section";
import { TitleEtablissementWithDenomination } from "#components/title-section/etablissement";
import { estNonDiffusibleStrict } from "#models/core/diffusion";
import { isServicePublic } from "#models/core/types";
import {
  etablissementPageDescription,
  etablissementPageTitle,
  shouldNotIndex,
} from "#utils/helpers";
import { cachedEtablissementWithUniteLegale } from "#utils/server-side-helper/cached-methods";
import extractParamsAppRouter, {
  type AppRouterProps,
} from "#utils/server-side-helper/extract-params";
import getSession from "#utils/server-side-helper/get-session";

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = await extractParamsAppRouter(props);
  const { uniteLegale, etablissement } =
    await cachedEtablissementWithUniteLegale(slug, isBot);

  const title = `${
    etablissement.estSiege ? "Siège social" : "Etablissement secondaire"
  } - ${etablissementPageTitle(etablissement, uniteLegale)}`;

  return {
    title,
    description: etablissementPageDescription(etablissement, uniteLegale),
    robots: shouldNotIndex(uniteLegale) ? "noindex, nofollow" : "index, follow",
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/etablissement/${etablissement.siret}`,
    },
  };
};

export default async function EtablissementPage(props: AppRouterProps) {
  const { slug, isBot, isRedirected } = await extractParamsAppRouter(props);
  const { etablissement, uniteLegale } =
    await cachedEtablissementWithUniteLegale(slug, isBot);

  const session = await getSession();

  return (
    <>
      {isRedirected && (
        <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />
      )}
      <div className="content-container">
        <TitleEtablissementWithDenomination
          etablissement={etablissement}
          session={session}
          uniteLegale={uniteLegale}
        />
        {estNonDiffusibleStrict(etablissement) ? (
          <NonDiffusibleStrictSection />
        ) : (
          <EtablissementSection
            etablissement={etablissement}
            session={session}
            uniteLegale={uniteLegale}
            usedInEntreprisePage={false}
            withDenomination={true}
          />
        )}
        {!isBot && isServicePublic(uniteLegale) && (
          <ServicePublicSection
            etablissement={etablissement}
            uniteLegale={uniteLegale}
          />
        )}
      </div>
    </>
  );
}
