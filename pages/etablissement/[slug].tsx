import { GetServerSideProps } from 'next';
import React from 'react';
import Meta from '#components/meta';
import { estNonDiffusible } from '#models/statut-diffusion';
import { shouldNotIndex } from '#utils/helpers';
import {
  getCompanyPageDescription,
  getCompanyPageTitle,
} from '#utils/helpers/get-company-page-title';
import EtablissementSection from 'components/etablissement-section';
import MatomoEventRedirected from 'components/matomo-event/search-redirected';
import { NonDiffusibleSection } from 'components/non-diffusible';
import { TitleEtablissementWithDenomination } from 'components/title-etablissement-section';
import Title, { FICHE } from 'components/title-section';
import { getEtablissementWithUniteLegaleFromSlug } from 'models/etablissement';
import { IEtablissement, IUniteLegale } from 'models/index';
import { NextPageWithLayout } from 'pages/_app';
import extractParamsFromContext from 'utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from 'utils/server-side-props-helper/post-server-side-props';

interface IProps extends IPropsWithMetadata {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  redirected: boolean;
}

const EtablissementPage: NextPageWithLayout<IProps> = ({
  etablissement,
  uniteLegale,
  redirected,
  metadata: { session },
}) => (
  <>
    <Meta
      title={`${
        etablissement.estSiege ? 'Siège social' : 'Etablissement secondaire'
      } - ${getCompanyPageTitle(uniteLegale)}`}
      description={getCompanyPageDescription(uniteLegale)}
      canonical={`https://annuaire-entreprises.data.gouv.fr/etablissement/${etablissement.siret}`}
      noIndex={shouldNotIndex(uniteLegale)}
    />
    {redirected && <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />}
    <div className="content-container">
      <Title
        uniteLegale={uniteLegale}
        ficheType={FICHE.INFORMATION}
        session={session}
      />
      <TitleEtablissementWithDenomination
        uniteLegale={uniteLegale}
        etablissement={etablissement}
      />
      <br />
      {estNonDiffusible(etablissement) ? (
        <>
          <p>
            Cet établissement est <b>non-diffusible.</b>
          </p>
          <NonDiffusibleSection />
        </>
      ) : (
        <EtablissementSection
          etablissement={etablissement}
          uniteLegale={uniteLegale}
          withDenomination={true}
        />
      )}
    </div>
  </>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isBot, isRedirected } = extractParamsFromContext(
      context,
      true
    );

    const etablissementWithUniteLegale =
      await getEtablissementWithUniteLegaleFromSlug(slug, isBot);

    return {
      props: {
        ...etablissementWithUniteLegale,
        redirected: isRedirected,
      },
    };
  }
);

export default EtablissementPage;
