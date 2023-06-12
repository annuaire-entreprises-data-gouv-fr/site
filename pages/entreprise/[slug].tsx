import { GetServerSideProps } from 'next';
import React from 'react';
import AssociationSection from '#components/association-section';
import CollectiviteTerritorialeSection from '#components/collectivite-territoriale-section';
import DonneesRestreintesSection from '#components/donnees-restreintes-section/[slug]';
import EtablissementListeSection from '#components/etablissement-liste-section';
import EtablissementSection from '#components/etablissement-section';
import MatomoEventRedirected from '#components/matomo-event/search-redirected';
import Meta from '#components/meta';
import { NonDiffusibleSection } from '#components/non-diffusible';
import StructuredDataBreadcrumb from '#components/structured-data/breadcrumb';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import UniteLegaleSection from '#components/unite-legale-section';
import UsefulShortcuts from '#components/useful-shortcuts';
import {
  IDonneesRestreinteUniteLegale,
  getDonneesRestreintesEntreprise,
} from '#models/espace-agent/donnees-restreintes-entreprise';
import {
  isCollectiviteTerritoriale,
  IUniteLegale,
  isAssociation,
} from '#models/index';
import { estNonDiffusible } from '#models/statut-diffusion';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import {
  extractSirenOrSiretSlugFromUrl,
  shouldNotIndex,
  getCompanyPageDescription,
  getCompanyPageTitle,
} from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  postServerSideProps,
  IPropsWithMetadata,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isSuperAgent } from '#utils/session';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
  donneesRestreintesUniteLegale: IDonneesRestreinteUniteLegale;
  redirected: boolean;
}

const UniteLegalePage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  donneesRestreintesUniteLegale,
  redirected,
  metadata: { session },
}) => (
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
          {isSuperAgent(session) && donneesRestreintesUniteLegale ? (
            <DonneesRestreintesSection
              uniteLegale={uniteLegale}
              conformite={donneesRestreintesUniteLegale?.conformite}
            />
          ) : null}
          {isAssociation(uniteLegale) && (
            <AssociationSection uniteLegale={uniteLegale} />
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

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isRedirected, page, isBot } = extractParamsFromContext(
      context,
      true
    );

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

    let donneesRestreintesUniteLegale = null;
    if (isSuperAgent(context.req?.session)) {
      const { siren, siege } = uniteLegale;
      donneesRestreintesUniteLegale = await getDonneesRestreintesEntreprise(
        siren,
        siege.siret
      );
    }

    return {
      props: {
        uniteLegale,
        donneesRestreintesUniteLegale,
        redirected: isRedirected,
      },
    };
  }
);

export default UniteLegalePage;
