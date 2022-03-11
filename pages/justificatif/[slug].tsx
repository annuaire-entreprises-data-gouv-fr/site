import React from 'react';

import { GetServerSideProps } from 'next';
import { FICHE } from '../../components/title-section';
import getJustificatifs, { IJustificatifs } from '../../models/justificatifs';
import Immatriculations from '../../components/immatriculations';
import PageEntreprise from '../../layouts/page-entreprise';
import { IPropsWithSession, withSession } from '../../hocs/with-session';
import { withError } from '../../hocs/with-error';

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

export const getServerSideProps: GetServerSideProps = withError(
  withSession(async (context) => {
    //@ts-ignore
    const siren = context.params.slug as string;

    const justificatifs = await getJustificatifs(siren);

    return {
      props: justificatifs,
    };
  })
);

export default JustificatifPage;
