import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import Title, { FICHE } from '../../components/title-section';

import {
  getDirigeantsWithUniteLegaleFromSlug,
  IDirigeants,
} from '../../models/dirigeants';
import DirigeantsEntrepriseIndividuelleSection from '../../components/dirigeants-section/insee-dirigeant';
import DirigeantsSection from '../../components/dirigeants-section/rncs-dirigeants';
import BeneficiairesSection from '../../components/dirigeants-section/beneficiaires';
import DirigeantSummary from '../../components/dirigeants-section/summary';
import BreakPageForPrint from '../../components-ui/print-break-page';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import extractParamsFromContext from '../../utils/server-side-props-helper/extract-params-from-context';

interface IProps extends IPropsWithMetadata, IDirigeants {}

const DirigeantsPage: React.FC<IProps> = ({
  uniteLegale,
  immatriculationRNCS,
  metadata,
}) => {
  return (
    <Page
      small={true}
      title={`Dirigeants de l’entité - ${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
      canonical={`https://annuaire-entreprises.data.gouv.fr/dirigeants/${uniteLegale.siren}`}
      noIndex={true}
      isBrowserOutdated={metadata.isBrowserOutdated}
    >
      <div className="content-container">
        <Title uniteLegale={uniteLegale} ficheType={FICHE.DIRIGEANTS} />
        <>
          <DirigeantSummary
            uniteLegale={uniteLegale}
            immatriculationRNCS={immatriculationRNCS}
          />
          {uniteLegale.estDiffusible &&
            uniteLegale.complements.estEntrepreneurIndividuel &&
            uniteLegale.dirigeant && (
              <>
                <DirigeantsEntrepriseIndividuelleSection
                  dirigeant={uniteLegale.dirigeant}
                />
                <BreakPageForPrint />
              </>
            )}
          <DirigeantsSection
            immatriculationRNCS={immatriculationRNCS}
            siren={uniteLegale.siren}
          />
          <BreakPageForPrint />
          <BeneficiairesSection
            immatriculationRNCS={immatriculationRNCS}
            siren={uniteLegale.siren}
          />
        </>
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);
    return {
      props: await getDirigeantsWithUniteLegaleFromSlug(slug),
    };
  }
);

export default DirigeantsPage;
