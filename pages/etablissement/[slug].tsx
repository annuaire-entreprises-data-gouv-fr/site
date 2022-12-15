import { GetServerSideProps } from 'next';
import React from 'react';
import { shouldNotIndex } from '#utils/helpers';
import EtablissementSection from 'components/etablissement-section';
import MatomoEventRedirected from 'components/matomo-event/search-redirected';
import { NonDiffusibleSection } from 'components/non-diffusible';
import { TitleEtablissementWithDenomination } from 'components/title-etablissement-section';
import Title, { FICHE } from 'components/title-section';
import { getEtablissementWithUniteLegaleFromSlug } from 'models/etablissement';
import { IEtablissement, IUniteLegale } from 'models/index';
import extractParamsFromContext from 'utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from 'utils/server-side-props-helper/post-server-side-props';
import Page from '../../layouts';

interface IProps extends IPropsWithMetadata {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  redirected: boolean;
}

const EtablissementPage: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  redirected,
  metadata,
}) => (
  <Page
    small={true}
    title={`Etablissement - ${uniteLegale.nomComplet} - ${etablissement.siret}`}
    noIndex={shouldNotIndex(uniteLegale)}
    isBrowserOutdated={metadata.isBrowserOutdated}
  >
    {redirected && <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />}
    <div className="content-container">
      <Title uniteLegale={uniteLegale} ficheType={FICHE.INFORMATION} />
      <TitleEtablissementWithDenomination
        uniteLegale={uniteLegale}
        etablissement={etablissement}
      />
      <br />
      {etablissement.estDiffusible ? (
        <EtablissementSection
          etablissement={etablissement}
          uniteLegale={uniteLegale}
          withDenomination={true}
        />
      ) : (
        <>
          <p>
            Cet établissement est <b>non-diffusible.</b>
          </p>
          <NonDiffusibleSection />
        </>
      )}
    </div>
  </Page>
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
