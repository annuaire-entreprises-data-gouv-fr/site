import { GetStaticPaths, GetStaticProps } from 'next';
import React, { ReactElement } from 'react';
import { HomeH1 } from '#components-ui/logo/home-h1';
import { LayoutDefault } from '#components/layouts/layout-default';
import Meta from '#components/meta';
import SearchBar from '#components/search-bar';
import {
  getAllLandingPages,
  getLandingPage,
  ILandingPage,
} from '#models/landing-pages';
import { IPropsWithMetadata } from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata, ILandingPage {}

const LandingPage: NextPageWithLayout<IProps> = ({
  slug,
  title,
  description,
  filter,
  seo,
}) => (
  <>
    <Meta
      title={seo.title || title}
      canonical={`https://annuaire-entreprises.data.gouv.fr/rechercher/${slug}`}
      description={seo.description || description}
      noIndex={false}
    />
    <div className="layout-center">
      <form
        className="centered-search"
        id="search-bar-form"
        action={`/rechercher`}
        method="get"
      >
        <HomeH1>
          <b>{title}</b>
        </HomeH1>

        <h2>{description}</h2>
        <input
          style={{ display: 'none' }}
          name={filter.name}
          value={filter.value}
          readOnly
        />
        <div className="search-bar-wrapper">
          <SearchBar
            placeholder="Nom, adresse, n° SIRET/SIREN..."
            defaultValue=""
            autoFocus={true}
          />
        </div>
      </form>
    </div>
    <style jsx>{`
      h1 {
        font-size: 2.5rem;
        text-align: center;
      }
      h2 {
        text-align: center;
        margin-top: 30px;
      }

      .centered-search {
        margin-bottom: 32vh;
        margin-top: 10vh;
        max-width: 900px;
      }

      .search-bar-wrapper {
        margin: auto;
        margin-top: 30px;
        flex-direction: column;
        width: 100%;
        max-width: 450px;
      }
    `}</style>
  </>
);

LandingPage.getLayout = function getLayout(
  page: ReactElement,
  isBrowserOutdated: boolean
) {
  return (
    <LayoutDefault isBrowserOutdated={isBrowserOutdated} searchBar={false}>
      {page}
    </LayoutDefault>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllLandingPages().map(({ slug }) => {
      return {
        params: {
          slug,
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const landingPage = getLandingPage(slug);
  return {
    props: {
      ...landingPage,
    },
  };
};

export default LandingPage;
