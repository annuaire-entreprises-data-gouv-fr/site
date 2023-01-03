import { GetServerSideProps } from 'next';
import React from 'react';
import AssociationSection from '#components/association-section';
import CollectiviteTerritorialeSection from '#components/collectivite-territoriale-section';
import EtablissementListeSection from '#components/etablissement-liste-section';
import EtablissementSection from '#components/etablissement-section';
import MatomoEventRedirected from '#components/matomo-event/search-redirected';
import { NonDiffusibleSection } from '#components/non-diffusible';
import StructuredDataBreadcrumb from '#components/structured-data/breadcrumb';
import Title, { FICHE } from '#components/title-section';
import UniteLegaleSection from '#components/unite-legale-section';
import UsefulShortcuts from '#components/useful-shortcuts';
import {
  isCollectiviteTerritoriale,
  IUniteLegale,
  isAssociation,
} from '#models/index';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { extractSirenOrSiretSlugFromUrl, shouldNotIndex } from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  postServerSideProps,
  IPropsWithMetadata,
} from '#utils/server-side-props-helper/post-server-side-props';
import Page from '../../layouts';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
  redirected: boolean;
}

const UniteLegalePage: React.FC<IProps> = ({
  uniteLegale,
  redirected,
  metadata,
}) => (
  <Page
    small={true}
    title={`${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
    canonical={
      uniteLegale.chemin &&
      `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.chemin}`
    }
    description={`Toutes les informations officielles sur ${uniteLegale.nomComplet} :  Siren, Siret, NIC, APE/NAF, N° TVA, capital social, justificatif d’immatriculation, dirigeants, conventions collectives...`}
    noIndex={shouldNotIndex(uniteLegale)}
    isBrowserOutdated={metadata.isBrowserOutdated}
  >
    {redirected && <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />}
    <StructuredDataBreadcrumb uniteLegale={uniteLegale} />
    <div className="content-container">
      <Title uniteLegale={uniteLegale} ficheType={FICHE.INFORMATION} />
      {uniteLegale.estDiffusible ? (
        <>
          <UniteLegaleSection uniteLegale={uniteLegale} />
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
            />
          )}
          <EtablissementListeSection uniteLegale={uniteLegale} />
        </>
      ) : (
        <NonDiffusibleSection />
      )}
    </div>
  </Page>
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

    return {
      props: {
        uniteLegale,
        redirected: isRedirected,
      },
    };
  }
);

export default UniteLegalePage;
