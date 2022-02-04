import React from 'react';
import { GetServerSideProps } from 'next';

import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import ConventionCollectivesSection from '../../components/convention-collectives-section';
import getConventionCollectivesFromSlug, {
  IConventions,
} from '../../models/convention-collective';
import PageEntreprise from '../../layouts/page-entreprise';
import { FICHE } from '../../components/title-section';
import { IPropsWithSession, withSession } from '../../hocs/with-session';

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

export const getServerSideProps: GetServerSideProps = withSession(
  async (context) => {
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
  }
);

export default ConventionsCollectives;
