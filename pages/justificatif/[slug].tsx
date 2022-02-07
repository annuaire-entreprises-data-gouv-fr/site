import React from 'react';

import { GetServerSideProps } from 'next';
import { FICHE } from '../../components/title-section';
import getJustificatifs, { IJustificatifs } from '../../models/justificatifs';
import Immatriculations from '../../components/immatriculations';
import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import PageEntreprise from '../../layouts/page-entreprise';
import { IPropsWithSession, withSession } from '../../hocs/with-session';

interface IProps extends IJustificatifs, IPropsWithSession {}

const JustificatifPage: React.FC<IProps> = ({
  uniteLegale,
  immatriculationRNM,
  immatriculationRNCS,
  immatriculationJOAFE,
  session,
}) => (
  <PageEntreprise
    title={`Justificatif d’immatriculation - ${uniteLegale.nomComplet}`}
    noIndex={true}
    uniteLegale={uniteLegale}
    currentTab={FICHE.JUSTIFICATIFS}
    session={session}
  >
    <Immatriculations
      immatriculationRNM={immatriculationRNM}
      immatriculationRNCS={immatriculationRNCS}
      immatriculationJOAFE={immatriculationJOAFE}
      uniteLegale={uniteLegale}
    />
  </PageEntreprise>
);

export const getServerSideProps: GetServerSideProps = withSession(
  async (context) => {
    //@ts-ignore
    const siren = context.params.slug as string;

    try {
      const justificatifs = await getJustificatifs(siren);

      return {
        props: justificatifs,
      };
    } catch (e: any) {
      return redirectIfIssueWithSiren(e, siren, context.req);
    }
  }
);

export default JustificatifPage;
