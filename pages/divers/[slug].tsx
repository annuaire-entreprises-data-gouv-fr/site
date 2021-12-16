import React from 'react';
import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import Title, { FICHE } from '../../components/title-section';

import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import ConventionCollectivesSection from '../../components/convention-collectives-section';
import getConventionCollectivesFromSlug, {
  IConventions,
} from '../../models/convention-collective';

const ConventionsCollectives: React.FC<IConventions> = ({
  uniteLegale,
  conventionCollectives,
}) => (
  <Page
    small={true}
    title={`Conventions collectives - ${uniteLegale.nomComplet}`}
    noIndex={true}
  >
    <div className="content-container">
      <Title ficheType={FICHE.DIVERS} uniteLegale={uniteLegale} />
      <ConventionCollectivesSection
        conventionCollectives={conventionCollectives}
      />
    </div>
  </Page>
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
