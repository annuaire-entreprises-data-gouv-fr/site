import { GetServerSideProps } from 'next';
import Meta from '#components/meta';
import { TitleEtablissementWithDenomination } from '#components/title-section/etablissement';
import { getEtablissementWithUniteLegaleFromSlug } from '#models/core/etablissement';
import { estNonDiffusible } from '#models/core/statut-diffusion';
import { IEtablissement, IUniteLegale } from '#models/core/types';
import {
  etablissementPageDescription,
  etablissementPageTitle,
  shouldNotIndex,
} from '#utils/helpers';
import EtablissementSection from 'components/etablissement-section';
import MatomoEventRedirected from 'components/matomo-event/search-redirected';
import { NonDiffusibleSection } from 'components/non-diffusible';
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
    </div>
  </>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isBot, isRedirected } = extractParamsFromContext(context);

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
