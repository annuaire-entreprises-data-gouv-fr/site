import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { isCollectiviteTerritoriale, IUniteLegale } from '../../models';
import UniteLegaleSection from '../../components/unite-legale-section';
import EtablissementListeSection from '../../components/etablissement-liste-section';
import Title, { FICHE } from '../../components/title-section';

import EtablissementSection from '../../components/etablissement-section';

import { NonDiffusibleSection } from '../../components/non-diffusible';
import { getUniteLegaleFromSlug } from '../../models/unite-legale';
import AssociationSection from '../../components/association-section';
import StructuredDataBreadcrumb from '../../components/structured-data/breadcrumb';
import { shouldNotIndex } from '../../utils/helpers/checks';
import UsefulShortcuts from '../../components/useful-shortcuts';
import MatomoEventRedirected from '../../components/matomo-event/search-redirected';
import { extractSirenOrSiretSlugFromUrl } from '../../utils/helpers/siren-and-siret';
import {
  postServerSideProps,
  IPropsWithMetadata,
} from '../../utils/server-side-props-helper/post-server-side-props';
import extractParamsFromContext from '../../utils/server-side-props-helper/extract-params-from-context';
import { isAssociation } from '../../models';
import CollectiviteTerritorialeSection from '../../components/collectivite-territoriale-section';

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

    const uniteLegale = await getUniteLegaleFromSlug(slug, {
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
