import React from 'react';
import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import Title, { FICHE } from '../../components/title-section';

import ConventionCollectivesSection from '../../components/convention-collectives-section';
import getConventionCollectivesFromSlug, {
  IConventions,
} from '../../models/convention-collective';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import extractParamsFromContext from '../../utils/server-side-props-helper/extract-params-from-context';

interface IProps extends IPropsWithMetadata, IConventions {}

const ConventionsCollectives: React.FC<IProps> = ({
  uniteLegale,
  conventionCollectives,
  metadata,
}) => (
  <Page
    small={true}
    title={`Conventions collectives - ${uniteLegale.nomComplet}`}
    noIndex={true}
    isBrowserOutdated={metadata.isBrowserOutdated}
  >
    <div className="content-container">
      <Title ficheType={FICHE.DIVERS} uniteLegale={uniteLegale} />
      <ConventionCollectivesSection
        conventionCollectives={conventionCollectives}
      />
    </div>
  </Page>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);

    const { uniteLegale, conventionCollectives } =
      await getConventionCollectivesFromSlug(slug);

    return {
      props: {
        uniteLegale,
        conventionCollectives,
      },
    };
  }
);

export default ConventionsCollectives;
