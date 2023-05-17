import { GetServerSideProps } from 'next';
import React from 'react';
import ConventionCollectivesSection from '#components/convention-collectives-section';
import Meta from '#components/meta';
import Title, { FICHE } from '#components/title-section';
import getConventionCollectivesFromSlug, {
  IConventions,
} from '#models/convention-collective';
import {
  getCompanyPageDescription,
  getCompanyPageTitle,
} from '#utils/helpers/get-company-page-title';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata, IConventions {}

const ConventionsCollectives: NextPageWithLayout<IProps> = ({
  uniteLegale,
  conventionCollectives,
  metadata: { session },
}) => (
  <>
    <Meta
      noIndex={true}
      title={`Conventions collectives - ${getCompanyPageTitle(
        uniteLegale,
        session
      )}`}
      description={getCompanyPageDescription(uniteLegale, session)}
      canonical={`https://annuaire-entreprises.data.gouv.fr/divers/${uniteLegale.siren}`}
    />
    <div className="content-container">
      <Title
        ficheType={FICHE.DIVERS}
        uniteLegale={uniteLegale}
        session={session}
      />
      <ConventionCollectivesSection
        conventionCollectives={conventionCollectives}
      />
    </div>
  </>
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
