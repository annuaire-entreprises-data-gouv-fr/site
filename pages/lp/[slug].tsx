import { GetStaticPaths, GetStaticProps } from 'next';
import React, { ReactElement } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { diamond } from '#components-ui/logo/home-h1';
import AdministrationDescription from '#components/administrations/administration-description';
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
  reassurance = [],
  datasources = [],
  body,
}) => (
  <>
    <Meta
      title={seo.title || title}
      canonical={`https://annuaire-entreprises.data.gouv.fr/lp/${slug}`}
      description={seo.description || description}
      noIndex={false}
    />
    <form
      className="centered-search layout-center"
      id="search-bar-form"
      action={`/rechercher`}
      method="get"
    >
      <h1>
        <span className="diamond">{diamond}</span>
        {title}
      </h1>
      <h2 className="sub-title">{description}</h2>
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
    <div className="content-container">
      <div className="fr-grid-row fr-grid-row--start fr-grid-row--gutters">
        {reassurance.map((block) => (
          <div key={block.title} className="fr-col-12 fr-col-sm-4 fr-col-md-4">
            <div className="reassurance">
              <h2>{block.title}</h2>
              <ReactMarkdown>{block.body}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <br />
      {body && <ReactMarkdown>{body}</ReactMarkdown>}
      {datasources.length > 0 && (
        <h2>Quelles sont les sources des données utilisées ?</h2>
      )}
      {datasources.map((source) => (
        <React.Fragment key={source}>
          <AdministrationDescription slug={source} titleLevel="h3" />
        </React.Fragment>
      ))}
    </div>

    <style jsx>{`
      h1 {
        font-size: 2.2rem;
        text-align: center;
        position: relative;
      }
      .diamond {
        position: absolute;
        top: -30px;
        left: -30px;
        z-index: -1;
        color: #ffeff0;
      }

      .sub-title {
        text-align: center;
        margin-top: 20px;
      }

      .centered-search {
        margin: auto;
        margin-bottom: 26vh;
        margin-top: 10vh;
        max-width: 900px;
        flex-direction: column;
      }

      .search-bar-wrapper {
        margin: auto;
        margin-top: 30px;
        flex-direction: column;
        width: 100%;
        max-width: 450px;
      }

      .reassurance {
        padding: 10px 20px;
        height: 100%;
        background: #f4f4f4;
        border-radius: 2px;
      }
      .reassurance h2 {
        margin-top: 10px;
      }

      @media only screen and (min-width: 1px) and (max-width: 576px) {
        h1 {
          font-size: 1.5rem;
          line-height: 2rem;
        }
        .diamond {
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
        }
        .centered-search {
          margin-bottom: 15vh;
        }
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
