import React from 'react';

import { GetServerSideProps } from 'next';
import { FICHE } from '../../components/title-section';

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
import PageEntreprise from '../../layouts/page-entreprise';
import { withDirigeantSession } from '../../hocs/with-dirigeant-session';

const DirigeantsPage: React.FC<IDirigeants> = ({
  uniteLegale,
  dirigeants,
  beneficiaires,
}) => {
  return (
    <PageEntreprise
      title={`Dirigeants de l’entité - ${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
      canonical={`https://annuaire-entreprises.data.gouv.fr/dirigeants/${uniteLegale.siren}`}
      noIndex={true}
      uniteLegale={uniteLegale}
      currentTab={FICHE.DIRIGEANTS}
    >
      <DirigeantSummary
        uniteLegale={uniteLegale}
        dirigeants={dirigeants}
        beneficiaires={beneficiaires}
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
      <DirigeantsSection dirigeants={dirigeants} siren={uniteLegale.siren} />
      <BreakPageForPrint />
      <BeneficiairesSection
        beneficiaires={beneficiaires}
        siren={uniteLegale.siren}
      />
    </PageEntreprise>
  );
};

export const getServerSideProps: GetServerSideProps = withDirigeantSession(
  async (context) => {
    //@ts-ignore
    const slug = context.params.slug as string;
    try {
      return {
        props: await getDirigeantsWithUniteLegaleFromSlug(slug),
      };
    } catch (e: any) {
      return redirectIfIssueWithSiren(e, slug, context.req);
    }
  }
);

export default DirigeantsPage;
