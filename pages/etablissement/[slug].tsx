import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { IEtablissement, IUniteLegale } from '../../models';
import EtablissementSection from '../../components/etablissement-section';
import Title, { FICHE } from '../../components/title-section';
import { NonDiffusibleSection } from '../../components/non-diffusible';
import { getEtablissementWithUniteLegaleFromSlug } from '../../models/etablissement';
import { TitleEtablissementWithDenomination } from '../../components/title-etablissement-section';
import { shouldNotIndex } from '../../utils/helpers/checks';
import MatomoEventRedirected from '../../components/matomo-event/search-redirected';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import extractParamsFromContext from '../../utils/server-side-props-helper/extract-params-from-context';

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
