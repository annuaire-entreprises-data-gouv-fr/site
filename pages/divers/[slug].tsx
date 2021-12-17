import React from 'react';
import { GetServerSideProps } from 'next';

import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import ConventionCollectivesSection from '../../components/convention-collectives-section';
import getConventionCollectivesFromSlug, {
  IConventions,
} from '../../models/convention-collective';
import PageEntreprise from '../../layouts/page-entreprise';
import { FICHE } from '../../components/title-section';

const ConventionsCollectives: React.FC<IConventions> = ({
  uniteLegale,
  conventionCollectives,
}) => (
  <PageEntreprise
    title={`Conventions collectives - ${uniteLegale.nomComplet}`}
    noIndex={true}
    uniteLegale={uniteLegale}
    currentTab={FICHE.DIVERS}
  >
    <ConventionCollectivesSection
      conventionCollectives={conventionCollectives}
    />
  </PageEntreprise>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siren = context.params.slug as string;

  try {
    const { uniteLegale, conventionCollectives } =
      await getConventionCollectivesFromSlug(siren);

    return {
      props: {
        uniteLegale,
        conventionCollectives,
      },
    };
  } catch (e: any) {
    return redirectIfIssueWithSiren(e, siren, context.req);
  }
};

export default ConventionsCollectives;
