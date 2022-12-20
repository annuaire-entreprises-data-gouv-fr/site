import { GetServerSideProps } from 'next';
import React from 'react';
import BreakPageForPrint from '#components-ui/print-break-page';
import BeneficiairesSection from '#components/dirigeants-section/beneficiaires';
import DirigeantsEntrepriseIndividuelleSection from '#components/dirigeants-section/insee-dirigeant';
import DirigeantsSection from '#components/dirigeants-section/rncs-dirigeants';
import DirigeantSummary from '#components/dirigeants-section/summary';
import { DirigeantsNonDiffusibleSection } from '#components/non-diffusible';
import Title, { FICHE } from '#components/title-section';
import {
  getDirigeantsWithUniteLegaleFromSlug,
  IDirigeants,
} from '#models/dirigeants';
import { estDiffusible } from '#models/statut-diffusion';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import Page from '../../layouts';

interface IProps extends IPropsWithMetadata, IDirigeants {}

const DirigeantsPage: React.FC<IProps> = ({
  uniteLegale,
  immatriculationRNCS,
  metadata,
}) => {
  return (
    <Page
      small={true}
      title={`Dirigeants de la structure - ${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
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
          {estDiffusible(uniteLegale) ? (
            <>
              {uniteLegale.complements.estEntrepreneurIndividuel &&
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
          ) : (
            <DirigeantsNonDiffusibleSection />
          )}
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
