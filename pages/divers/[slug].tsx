import { GetServerSideProps } from 'next';
import React from 'react';
import Meta from '#components/meta';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { getCompanyPageDescription, getCompanyPageTitle } from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';
import { IUniteLegale } from '#models/index';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import ConventionsCollectivesSection from '#components/conventions-collectives-section';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
}

const ConventionsCollectives: NextPageWithLayout<IProps> = ({
  uniteLegale,
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
      <ConventionsCollectivesSection uniteLegale={uniteLegale} />
    </div>
  </>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);

    const uniteLegale = await getUniteLegaleFromSlug(slug);

    return {
      props: {
        uniteLegale,
      },
    };
  }
);

export default ConventionsCollectives;
