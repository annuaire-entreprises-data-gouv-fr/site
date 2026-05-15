import { createFileRoute, notFound } from "@tanstack/react-router";
import { Fragment } from "react";
import AdministrationDescription from "#/components/administrations/administration-description";
import { RenderMarkdown } from "#/components/markdown";
import { NotFound } from "#/components/screens/not-found";
import SearchBar from "#/components/search-bar";
import { diamond } from "#/components-ui/logo-annuaire/logo-annuaire";
import { getLandingPage } from "#/models/landing-pages";
import { meta } from "#/utils/seo";
import { HeaderHomeError } from "../-error";
import styles from "./style.module.css";

export const Route = createFileRoute("/_header-home/lp/$slug")({
  loader: async ({ params }) => {
    const landingPage = getLandingPage(params.slug);
    if (!landingPage) {
      throw notFound();
    }

    return {
      landingPage,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }
    const { landingPage } = loaderData;

    const canonical = `https://annuaire-entreprises.data.gouv.fr/lp/${landingPage.slug}`;
    return {
      meta: meta({
        title: landingPage.seo.title || landingPage.title,
        description: landingPage.seo.description,
        robots: "index, follow",
        alternates: {
          canonical,
        },
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderHomeError,
  notFoundComponent: () => <NotFound withWrapper={false} />,
});

function RouteComponent() {
  const { landingPage } = Route.useLoaderData();

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
                <RenderMarkdown>{block.body}</RenderMarkdown>
              </div>
            </div>
          ))}
        </div>
        <br />
        <RenderMarkdown>{body}</RenderMarkdown>{" "}
        {datasources.length > 0 && (
          <h2>Quelles sont les sources des données utilisées ?</h2>
        )}
        {datasources.map((source) => (
          <Fragment key={source}>
            <AdministrationDescription slug={source} titleLevel="h3" />
          </Fragment>
        ))}
      </div>
    </>
  );
}
