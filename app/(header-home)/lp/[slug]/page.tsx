import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React, { ReactElement } from 'react';
import { diamond } from '#components-ui/logo-annuaire/logo-annuaire';
import AdministrationDescription from '#components/administrations/administration-description';
import { RenderMarkdownServerOnly } from '#components/markdown';
import SearchBar from '#components/search-bar';
import { getAllLandingPages, getLandingPage } from '#models/landing-pages';
import styles from './style.module.css';

type IParams = {
  slug: string;
};

export default (function LandingPage({
  params,
}: {
  params: IParams;
}): ReactElement {
  const slug = params.slug;
  const landingPage = getLandingPage(slug);
  if (!landingPage) {
    notFound();
  }
  const {
    title,
    description,
    filter,
    reassurance = [],
    datasources = [],
    body,
  } = landingPage;
  return (
    <>
      <form
        className={`${styles['centered-search']} layout-center`}
        id="search-bar-form"
        action={`/rechercher`}
        method="get"
      >
        <h1>
          <span className={styles.diamond}>
            <span>{diamond}</span>Rechercher
            <br />
          </span>
          {title}
        </h1>
        <h2 className={styles['sub-title']}>{description}</h2>
        <input
          style={{ display: 'none' }}
          name={filter.name}
          value={filter.value}
          readOnly
        />
        <div className={styles['search-bar-wrapper']}>
          <SearchBar
            placeholder="Nom, adresse, n° SIRET/SIREN..."
            defaultValue=""
            autoFocus={true}
          />
        </div>
      </form>
      <div className={styles['content-container']}>
        <div className="fr-grid-row fr-grid-row--start fr-grid-row--gutters">
          {reassurance.map((block) => (
            <div
              key={block.title}
              className="fr-col-12 fr-col-sm-4 fr-col-md-4"
            >
              <div className={styles['reassurance']}>
                <h2>{block.title}</h2>
                <RenderMarkdownServerOnly>
                  {block.body}
                </RenderMarkdownServerOnly>
              </div>
            </div>
          ))}
        </div>
        <br />
        <RenderMarkdownServerOnly>{body}</RenderMarkdownServerOnly>{' '}
        {datasources.length > 0 && (
          <h2>Quelles sont les sources des données utilisées ?</h2>
        )}
        {datasources.map((source) => (
          <React.Fragment key={source}>
            <AdministrationDescription slug={source} titleLevel="h3" />
          </React.Fragment>
        ))}
      </div>
    </>
  );
});

export async function generateStaticParams(): Promise<Array<IParams>> {
  return getAllLandingPages().map(({ slug }) => {
    return {
      slug,
    };
  });
}

export const generateMetadata = function ({
  params,
}: {
  params: IParams;
}): Metadata {
  const landingPage = getLandingPage(params.slug);
  if (!landingPage) {
    notFound();
  }
  return {
    title: landingPage.seo.title || landingPage.title,
    description: landingPage.seo.description,
    robots: 'index, follow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/lp/${params.slug}`,
    },
  };
};
