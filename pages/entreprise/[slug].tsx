import { GetServerSideProps } from 'next';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import AssociationSection from '#components/association-section';
import CollectiviteTerritorialeSection from '#components/collectivite-territoriale-section';
import { EspaceAgentSummarySection } from '#components/espace-agent-components/summary-section';
import EtablissementListeSection from '#components/etablissement-liste-section';
import EtablissementSection from '#components/etablissement-section';
import MatomoEventRedirected from '#components/matomo-event/search-redirected';
import Meta from '#components/meta';
import { NonDiffusibleSection } from '#components/non-diffusible';
import ServicePublicSection from '#components/service-public-section';
import StructuredDataBreadcrumb from '#components/structured-data/breadcrumb';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import UniteLegaleSection from '#components/unite-legale-section';
import UsefulShortcuts from '#components/useful-shortcuts';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { getAssociation } from '#models/association';
import { IDataAssociation } from '#models/association/types';
import { estNonDiffusible } from '#models/core/statut-diffusion';
import {
  IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
} from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import {
  IServicePublic,
  getServicePublicByUniteLegale,
} from '#models/service-public';
import {
  extractSirenOrSiretSlugFromUrl,
  shouldNotIndex,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isSuperAgent } from '#utils/session';
import useSession from 'hooks/use-session';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
  association: IDataAssociation | IAPINotRespondingError | null;
  servicePublic: IServicePublic | IAPINotRespondingError | null;
  redirected: boolean;
}

const UniteLegalePage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  association,
  servicePublic,
  redirected,
}) => {
  const session = useSession();
  return (
    <>
      <Meta
        title={uniteLegalePageTitle(uniteLegale, session)}
        description={uniteLegalePageDescription(uniteLegale, session)}
        noIndex={shouldNotIndex(uniteLegale)}
        canonical={`https://annuaire-entreprises.data.gouv.fr/entreprise/${
          uniteLegale.chemin || uniteLegale.siren
        }`}
      />
      {redirected && <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />}

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
            {isCollectiviteTerritoriale(uniteLegale) && (
              <CollectiviteTerritorialeSection uniteLegale={uniteLegale} />
            )}
            {servicePublic && (
              <ServicePublicSection
                uniteLegale={uniteLegale}
                servicePublic={servicePublic}
              />
            )}
            {(isCollectiviteTerritoriale(uniteLegale) ||
              (servicePublic && !isAPINotResponding(servicePublic))) && (
              <>
                <HorizontalSeparator />
                <BreakPageForPrint />
              </>
            )}
            {isAssociation(uniteLegale) && (
              <AssociationSection
                uniteLegale={uniteLegale}
                association={association}
              />
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

    const [association, servicePublic] = await Promise.all([
      getAssociation(uniteLegale, { isBot }),
      getServicePublicByUniteLegale(uniteLegale, {
        isBot,
      }),
    ]);

    return {
      props: {
        uniteLegale,
        association,
        servicePublic,
        redirected: isRedirected,
      } as IProps,
    };
  }
);

export default UniteLegalePage;
