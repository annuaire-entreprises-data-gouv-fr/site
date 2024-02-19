import { GetServerSideProps } from 'next';
import Meta from '#components/meta';
import { NonDiffusibleSection } from '#components/non-diffusible-section';
import ServicePublicSection from '#components/service-public-section';
import { TitleEtablissementWithDenomination } from '#components/title-section/etablissement';
import { getEtablissementWithUniteLegaleFromSlug } from '#models/core/etablissement';
import { estNonDiffusible } from '#models/core/statut-diffusion';
import { IEtablissement, IUniteLegale } from '#models/core/types';
import {
  IServicePublic,
  getServicePublicByEtablissement,
} from '#models/service-public';
import {
  etablissementPageDescription,
  etablissementPageTitle,
  shouldNotIndex,
} from '#utils/helpers';
import extractParamsPageRouter from '#utils/server-side-props-helper/extract-params-page-router';
import EtablissementSection from 'components/etablissement-section';
import MatomoEventRedirected from 'components/matomo-event/search-redirected';
import { NextPageWithLayout } from 'pages/_app';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from 'utils/server-side-props-helper/post-server-side-props';

interface IProps extends IPropsWithMetadata {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  servicePublic: IServicePublic | null;
  redirected: boolean;
}

const EtablissementPage: NextPageWithLayout<IProps> = ({
  etablissement,
  uniteLegale,
  redirected,
  servicePublic,
  metadata: { session },
}) => (
  <>
    <Meta
      title={`${
        etablissement.estSiege ? 'Siège social' : 'Etablissement secondaire'
      } - ${etablissementPageTitle(etablissement, uniteLegale, session)}`}
      description={etablissementPageDescription(
        etablissement,
        uniteLegale,
        session
      )}
      canonical={`https://annuaire-entreprises.data.gouv.fr/etablissement/${etablissement.siret}`}
      noIndex={shouldNotIndex(uniteLegale)}
    />
    {redirected && <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />}
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

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isBot, isRedirected } = extractParamsPageRouter(context);

    const etablissementWithUniteLegale =
      await getEtablissementWithUniteLegaleFromSlug(slug, isBot);

    const servicePublic = await getServicePublicByEtablissement(
      etablissementWithUniteLegale.uniteLegale,
      etablissementWithUniteLegale.etablissement,
      { isBot }
    );

    return {
      props: {
        ...etablissementWithUniteLegale,
        servicePublic,
        redirected: isRedirected,
      },
    };
  }
);

export default EtablissementPage;
