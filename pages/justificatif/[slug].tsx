import React from 'react';

import { GetServerSideProps } from 'next';
import { FICHE } from '../../components/title-section';
import getJustificatifs, { IJustificatifs } from '../../models/justificatifs';
import Immatriculations from '../../components/immatriculations';
import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import PageEntreprise from '../../layouts/page-entreprise';

const JustificatifPage: React.FC<IJustificatifs> = ({
  uniteLegale,
  immatriculationRNM,
  immatriculationRNCS,
  immatriculationJOAFE,
}) => (
  <PageEntreprise
    title={`Justificatif d’immatriculation - ${uniteLegale.nomComplet}`}
    noIndex={true}
    uniteLegale={uniteLegale}
    currentTab={FICHE.JUSTIFICATIFS}
  >
    <Immatriculations
      immatriculationRNM={immatriculationRNM}
      immatriculationRNCS={immatriculationRNCS}
      immatriculationJOAFE={immatriculationJOAFE}
      uniteLegale={uniteLegale}
    />
  </PageEntreprise>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
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
};

export default JustificatifPage;
