import React from 'react';

import { GetServerSideProps } from 'next';
import { IUniteLegale } from '../../models';
import { FICHE } from '../../components/title-section';

import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import PageEntreprise from '../../layouts/page-entreprise';
import StructuredDataBreadcrumb from '../../components/structured-data/breadcrumb';
import { IPropsWithSession, withSession } from '../../hocs/with-session';
import { getUniteLegaleFromSlug } from '../../models/unite-legale';
import SectionDashboard from '../../components/section-dashboard';
import SectionDashboardGrid from '../../components/section-dashboard/grid';
import DashboardInformationsGenerales from '../../components/unite-legale-dashboard/informations-generales';
import DashboardJustificatifs from '../../components/unite-legale-dashboard/justificatifs';
import DashboardAttestations from '../../components/unite-legale-dashboard/attestations';
import DashboardJuridiques from '../../components/unite-legale-dashboard/juridiques';

interface IProps extends IPropsWithSession {
  uniteLegale: IUniteLegale;
}

const AccountPage: React.FC<IProps> = ({ uniteLegale, session }) => (
  <PageEntreprise
    title={`${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
    canonical={
      uniteLegale.chemin &&
      `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.chemin}`
    }
    noIndex={
      uniteLegale.estEntrepreneurIndividuel && uniteLegale.estActive === false
    }
    uniteLegale={uniteLegale}
    currentTab={FICHE.ACCOUNT}
    session={session}
  >
    <StructuredDataBreadcrumb siren={uniteLegale.siren} />
    <SectionDashboardGrid>
      <DashboardInformationsGenerales uniteLegale={uniteLegale} />
      <DashboardJustificatifs uniteLegale={uniteLegale} />
      <DashboardAttestations uniteLegale={uniteLegale} />
      <DashboardJuridiques uniteLegale={uniteLegale} />
    </SectionDashboardGrid>
  </PageEntreprise>
);

export const getServerSideProps: GetServerSideProps = withSession(
  async (context) => {
    //@ts-ignore
    const siren = context.params.slug as string;
    try {
      return {
        props: {
          uniteLegale: await getUniteLegaleFromSlug(siren),
        },
      };
    } catch (e: any) {
      return redirectIfIssueWithSiren(e, siren, context.req);
    }
  }
);

export default AccountPage;
