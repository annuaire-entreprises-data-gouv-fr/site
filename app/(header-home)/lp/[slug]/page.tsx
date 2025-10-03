import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { use } from "react";
import AdministrationDescription from "#components/administrations/administration-description";
import { RenderMarkdownServerOnly } from "#components/markdown";
import SearchBar from "#components/search-bar";
import { diamond } from "#components-ui/logo-annuaire/logo-annuaire";
import { getAllLandingPages, getLandingPage } from "#models/landing-pages";
import type {
  AppRouterProps,
  IParams,
} from "#utils/server-side-helper/app/extract-params";
import styles from "./style.module.css";

export default function LandingPage(props: AppRouterProps) {
  const params = use(props.params);

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
        action={"/rechercher"}
        className={`${styles["centered-search"]} layout-center`}
        id="search-bar-form"
        method="get"
      >
        <h1>
          <span className={styles.diamond}>
            <span>{diamond}</span>Rechercher
            <br />
          </span>
          {title}
        </h1>
        <h2 className={styles["sub-title"]}>{description}</h2>
        <input
          name={filter.name}
          readOnly
          style={{ display: "none" }}
          value={filter.value}
        />
        <div className={styles["search-bar-wrapper"]}>
          <SearchBar
            autoFocus={true}
            defaultValue=""
            placeholder="Nom, adresse, n° SIRET/SIREN..."
          />
        </div>
      </form>
      <div className={styles["content-container"]}>
        <div className="fr-grid-row fr-grid-row--start fr-grid-row--gutters">
          {reassurance.map((block) => (
            <div
              className="fr-col-12 fr-col-sm-4 fr-col-md-4"
              key={block.title}
            >
              <div className={styles["reassurance"]}>
                <h2>{block.title}</h2>
                <RenderMarkdownServerOnly>
                  {block.body}
                </RenderMarkdownServerOnly>
              </div>
            </div>
          ))}
        </div>
        <br />
        <RenderMarkdownServerOnly>{body}</RenderMarkdownServerOnly>{" "}
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
}

export async function generateStaticParams(): Promise<Array<IParams>> {
  return getAllLandingPages().map(({ slug }) => ({
    slug,
  }));
}

export const generateMetadata = async ({
  params,
}: AppRouterProps): Promise<Metadata> => {
  const { slug } = await params;
  const landingPage = getLandingPage(slug);
  if (!landingPage) {
    notFound();
  }
  return {
    title: landingPage.seo.title || landingPage.title,
    description: landingPage.seo.description,
    robots: "index, follow",
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/lp/${slug}`,
    },
  };
};
