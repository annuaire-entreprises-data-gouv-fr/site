import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import Title, { FICHE } from '../../components/title-section';

import { NonDiffusibleSection } from '../../components/non-diffusible';
import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import {
  getDirigeantsWithUniteLegaleFromSlug,
  IDirigeants,
} from '../../models/dirigeants';
import DirigeantsEntrepriseIndividuelleSection from '../../components/dirigeants-section/insee-dirigeant';
import DirigeantsSection from '../../components/dirigeants-section/rncs-dirigeants';
import BeneficiairesSection from '../../components/dirigeants-section/beneficiaires';
import DirigeantSummary from '../../components/dirigeants-section/summary';
import BreakPageForPrint from '../../components/print-break-page';

const DirigeantsPage: React.FC<IDirigeants> = ({
  uniteLegale,
  immatriculationRNCS,
}) => {
  return (
    <Page
      small={true}
      title={`Dirigeants de l’entité - ${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
      canonical={`https://annuaire-entreprises.data.gouv.fr/dirigeants/${uniteLegale.siren}`}
      noIndex={true}
    >
      <div className="content-container">
        <Title uniteLegale={uniteLegale} ficheType={FICHE.DIRIGEANTS} />
        <>
          <DirigeantSummary
            uniteLegale={uniteLegale}
            immatriculationRNCS={immatriculationRNCS}
          />
          {uniteLegale.estDiffusible ? (
            uniteLegale.estEntrepreneurIndividuel &&
            uniteLegale.dirigeant && (
              <>
                <DirigeantsEntrepriseIndividuelleSection
                  dirigeant={uniteLegale.dirigeant}
                />
                <BreakPageForPrint />
              </>
            )
          ) : (
            <>
              <p>
                Cette entité est <b>non-diffusible.</b>
              </p>
              <NonDiffusibleSection />
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
      <style jsx>{`
        .content-container {
          margin: 20px auto 40px;
        }
      `}</style>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const slug = context.params.slug as string;
  try {
    return {
      props: await getDirigeantsWithUniteLegaleFromSlug(slug),
    };
  } catch (e: any) {
    return redirectIfIssueWithSiren(e, slug, context.req);
  }
};

export default DirigeantsPage;
