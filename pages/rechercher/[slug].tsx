import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import SearchBar from '#components/search-bar';
import StructuredDataSearchAction from '#components/structured-data/search';
import {
  getAllLandingPages,
  getLandingPage,
  ILandingPage,
} from '#models/landing-pages';
import { IPropsWithMetadata } from '#utils/server-side-props-helper/post-server-side-props';
import Page from '../../layouts';

interface IProps extends IPropsWithMetadata, ILandingPage {}

const LandingPage: React.FC<IProps> = ({
  slug,
  title,
  description,
  filter,
  seo,
}) => (
  <Page
    title={seo.title || title}
    canonical={`https://annuaire-entreprises.data.gouv.fr/rechercher/${slug}`}
    description={seo.description || description}
    noIndex={false}
  >
    <StructuredDataSearchAction />
    <div className="layout-center">
      <form
        className="centered-search"
        id="search-bar-form"
        action={`/rechercher`}
        method="get"
      >
        <h1>{title}</h1>
        <h2>{description}</h2>
        <input
          style={{ display: 'none' }}
          name={filter.name}
          value={filter.value}
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
  </Page>
);

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
