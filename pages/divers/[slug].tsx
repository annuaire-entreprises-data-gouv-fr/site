import React from 'react';
import { GetServerSideProps } from 'next';

import ConventionCollectivesSection from '../../components/convention-collectives-section';
import getConventionCollectivesFromSlug, {
  IConventions,
} from '../../models/convention-collective';
import PageEntreprise from '../../layouts/page-entreprise';
import { FICHE } from '../../components/title-section';
import { IPropsWithSession, withSession } from '../../hocs/with-session';
import { withError } from '../../hocs/with-error';

interface IProps extends IPropsWithSession, IConventions {}

const ConventionsCollectives: React.FC<IProps> = ({
  uniteLegale,
  conventionCollectives,
  session,
}) => (
  <PageEntreprise
    title={`Conventions collectives - ${uniteLegale.nomComplet}`}
    noIndex={true}
    uniteLegale={uniteLegale}
    currentTab={FICHE.DIVERS}
    session={session}
  >
    <ConventionCollectivesSection
      conventionCollectives={conventionCollectives}
    />
  </PageEntreprise>
);

export const getServerSideProps: GetServerSideProps = withError(
  withSession(async (context) => {
    //@ts-ignore
    const siren = context.params.slug as string;

    const { uniteLegale, conventionCollectives } =
      await getConventionCollectivesFromSlug(siren);

    return {
      props: {
        uniteLegale,
        conventionCollectives,
      },
    };
  })
);

export default ConventionsCollectives;
