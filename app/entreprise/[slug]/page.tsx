import AssociationSection from '#components/association-section';
import CollectiviteTerritorialeSection from '#components/collectivite-territoriale-section';
import { EspaceAgentSummarySection } from '#components/espace-agent-components/summary-section';
import EtablissementListeSection from '#components/etablissement-liste-section';
import EtablissementSection from '#components/etablissement-section';
import MatomoEventRedirected from '#components/matomo-event/search-redirected';
import { NonDiffusibleSection } from '#components/non-diffusible';
import StructuredDataBreadcrumb from '#components/structured-data/breadcrumb';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import UniteLegaleSection from '#components/unite-legale-section';
import UsefulShortcuts from '#components/useful-shortcuts';
import { getAssociation } from '#models/association';
import { estNonDiffusible } from '#models/core/statut-diffusion';
import { isAssociation, isCollectiviteTerritoriale } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import {
  shouldNotIndex,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-props-helper/extract-params-app-router';
import { isSuperAgent } from '#utils/session';
import useSession from 'hooks/use-session';
import { Metadata } from 'next';

export async function generateMetadata(
  props: AppRouterProps
): Promise<Metadata> {
  const { slug, page, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await getUniteLegaleFromSlug(slug, {
    page,
    isBot,
  });

  return {
    title: uniteLegalePageTitle(uniteLegale, null),
    description: uniteLegalePageDescription(uniteLegale, null),
    robots: shouldNotIndex(uniteLegale) ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/entreprise/${
        uniteLegale.chemin || uniteLegale.siren
      }`,
    },
  };
}

export default async function UniteLegalePage(props: AppRouterProps) {
  // TODO :  postServerSideProps

  const session = useSession();

  const { slug, isRedirected, page, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await getUniteLegaleFromSlug(slug, {
    page,
    isBot,
  });

  const shouldFetchAssociation = !isBot && isAssociation(uniteLegale);
  const association = shouldFetchAssociation
    ? await getAssociation(uniteLegale)
    : null;

  return (
    <>
      {isRedirected && (
        <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />
      )}

      <StructuredDataBreadcrumb uniteLegale={uniteLegale} />
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.INFORMATION}
          session={session}
        />
        {estNonDiffusible(uniteLegale) ? (
          <NonDiffusibleSection />
        ) : (
          <>
            <UniteLegaleSection uniteLegale={uniteLegale} session={session} />
            {isSuperAgent(session) && (
              <EspaceAgentSummarySection uniteLegale={uniteLegale} />
            )}
            {isAssociation(uniteLegale) && (
              <AssociationSection
                uniteLegale={uniteLegale}
                association={association}
              />
            )}
            {isCollectiviteTerritoriale(uniteLegale) && (
              <CollectiviteTerritorialeSection uniteLegale={uniteLegale} />
            )}
            <UsefulShortcuts uniteLegale={uniteLegale} />
            {uniteLegale.siege && (
              <EtablissementSection
                uniteLegale={uniteLegale}
                etablissement={uniteLegale.siege}
                usedInEntreprisePage={true}
                withDenomination={false}
                session={session}
              />
            )}
            <EtablissementListeSection
              uniteLegale={uniteLegale}
              session={session}
            />
          </>
        )}
      </div>
    </>
  );
}
