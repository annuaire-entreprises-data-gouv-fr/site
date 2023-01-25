import { GetServerSideProps } from 'next';
import React, { ReactElement } from 'react';
import HiddenH1 from '#components/a11y-components/hidden-h1';
import { SearchErrorExplanations } from '#components/error-explanations';
import { Layout } from '#components/layouts/layoutSearch';
import Meta from '#components/meta';
import StructuredDataSearchAction from '#components/structured-data/search';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

const SearchResultPage: NextPageWithLayout<IPropsWithMetadata> = ({}) => {
  return (
    <>
      <Meta
        title="Une erreur est survenue lors de votre recherche"
        canonical="https://annuaire-entreprises.data.gouv.fr/rechercher/erreur"
      />
      <StructuredDataSearchAction />
      <HiddenH1 title="Une erreur est survenue lors de votre recherche" />
      <div className="content-container">
        <SearchErrorExplanations />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async () => {
    return {
      props: {
        metadata: {
          useReact: true,
        },
      },
    };
  }
);

SearchResultPage.getLayout = function getLayout(
  page: ReactElement,
  isBrowserOutdated
) {
  return <Layout isBrowserOutdated={isBrowserOutdated}>{page}</Layout>;
};

export default SearchResultPage;
