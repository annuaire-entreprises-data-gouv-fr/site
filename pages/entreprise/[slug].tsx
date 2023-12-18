import { GetServerSideProps } from 'next';
import AssociationSection from '#components/association-section';
import CollectiviteTerritorialeSection from '#components/collectivite-territoriale-section';
import { EspaceAgentSummarySection } from '#components/espace-agent-components/summary-section';
import EtablissementListeSection from '#components/etablissement-liste-section';
import EtablissementSection from '#components/etablissement-section';
import MatomoEvent from '#components/matomo-event';
import MatomoEventRedirected from '#components/matomo-event/search-redirected';
import Meta from '#components/meta';
import { NonDiffusibleSection } from '#components/non-diffusible';
import StructuredDataBreadcrumb from '#components/structured-data/breadcrumb';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import UniteLegaleSection from '#components/unite-legale-section';
import UsefulShortcuts from '#components/useful-shortcuts';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { getAssociation } from '#models/association';
import {
  IDataAssociation,
  IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
} from '#models/index';
import { estNonDiffusible } from '#models/statut-diffusion';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import {
  extractSirenOrSiretSlugFromUrl,
  getCompanyPageDescription,
  getCompanyPageTitle,
  shouldNotIndex,
} from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isAgent, isSuperAgent } from '#utils/session';
import useSession from 'hooks/use-session';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
  association: IDataAssociation | IAPINotRespondingError | null;
  redirected: boolean;
}

const UniteLegalePage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  association,
  redirected,
}) => {
  const session = useSession();
  return (
    <>
      <Meta
        title={getCompanyPageTitle(uniteLegale, session)}
        description={getCompanyPageDescription(uniteLegale, session)}
        noIndex={shouldNotIndex(uniteLegale)}
        canonical={`https://annuaire-entreprises.data.gouv.fr/entreprise/${
          uniteLegale.chemin || uniteLegale.siren
        }`}
      />
      {redirected && <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />}

      {isAgent(session) && (
        <MatomoEvent
          category="espace-agent"
          action={`${isSuperAgent(session) ? 'super-agent' : 'agent'}`}
          name={`visit:${uniteLegale.siren}`}
        />
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
};
export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isRedirected, page, isBot } =
      extractParamsFromContext(context);

    const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(slug);
    if (sirenOrSiretSlug.length === 14) {
      // 14 digits is not a siren -> but it may be a siret
      return {
        redirect: {
          destination: `/etablissement/${sirenOrSiretSlug}`,
          permanent: false,
        },
      };
    }

    const uniteLegale = await getUniteLegaleFromSlug(sirenOrSiretSlug, {
      page,
      isBot,
    });

    const shouldFetchAssociation = !isBot && isAssociation(uniteLegale);
    const association = shouldFetchAssociation
      ? await getAssociation(uniteLegale)
      : null;

    return {
      props: {
        uniteLegale,
        association,
        redirected: isRedirected,
      },
    };
  }
);

export default UniteLegalePage;
