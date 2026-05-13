import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import HiddenH1 from "#/components/a11y-components/hidden-h1";
import { BannerManager } from "#/components/banner/banner-manager";
import { NPSBanner } from "#/components/banner/nps";
import Footer from "#/components/footer";
import { HeaderWithAdvancedSearch } from "#/components/header/header-advanced-search";
import SearchResults from "#/components/search-results";
import { AdvancedSearchTutorial } from "#/components/search-results/advanced-search-tutorial";
import SocialNetworks from "#/components/social-network";
import { searchWithoutProtectedSiren } from "#/models/search";
import SearchFilterParams, {
  hasSearchParam,
} from "#/models/search/search-filter-params";
import { meta } from "#/seo";
import { queryString } from "#/utils/query";
import { HeaderSearchError } from "./-error";
import { beforeLoadCheckTerme } from "./-loader";

const searchQueryParamsSchema = z.object({
  terme: queryString.catch(""),
  page: z.number().min(1).catch(1),
  cp_dep: queryString.catch(""),
  cp_dep_label: queryString.catch(""),
  cp_dep_type: queryString.catch(""),
  dmax: queryString.catch(""),
  dmin: queryString.catch(""),
  etat: queryString.catch(""),
  fn: queryString.catch(""),
  label: queryString.catch(""),
  n: queryString.catch(""),
  naf: queryString.catch(""),
  nature_juridique: queryString.catch(""),
  tranche_effectif_salarie: queryString.catch(""),
  categorie_entreprise: queryString.catch(""),
  sap: queryString.catch(""),
  type: queryString.catch(""),
  ca_min: z.number().nullable().catch(null),
  ca_max: z.number().nullable().catch(null),
  res_min: z.number().nullable().catch(null),
  res_max: z.number().nullable().catch(null),
});

const searchFn = createServerFn()
  .inputValidator(searchQueryParamsSchema)
  .handler(async ({ data }) => {
    const searchFilterParams = new SearchFilterParams(data);

    const searchResults = await searchWithoutProtectedSiren(
      data.terme,
      data.page,
      searchFilterParams
    );

    return {
      searchResults,
      searchFilterParamsJSON: searchFilterParams.toJSON(),
      searchTerm: data.terme,
    };
  });

export const Route = createFileRoute("/_header-search/rechercher")({
  validateSearch: searchQueryParamsSchema,
  loaderDeps: ({ search }) => ({
    terme: search.terme,
    page: search.page,
    cp_dep: search.cp_dep,
    cp_dep_label: search.cp_dep_label,
    cp_dep_type: search.cp_dep_type,
    dmax: search.dmax,
    dmin: search.dmin,
    etat: search.etat,
    fn: search.fn,
    label: search.label,
    n: search.n,
    naf: search.naf,
    nature_juridique: search.nature_juridique,
    tranche_effectif_salarie: search.tranche_effectif_salarie,
    categorie_entreprise: search.categorie_entreprise,
    sap: search.sap,
    type: search.type,
    ca_min: search.ca_min,
    ca_max: search.ca_max,
    res_min: search.res_min,
    res_max: search.res_max,
  }),
  head: () => {
    const canonical = "https://annuaire-entreprises.data.gouv.fr/rechercher";
    return {
      meta: meta({
        title: "Résultats de recherche",
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
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://annuaire-entreprises.data.gouv.fr",
            potentialAction: [
              {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://annuaire-entreprises.data.gouv.fr/rechercher?terme={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
              {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://annuaire-entreprises.data.gouv.fr/rechercher/carte?terme={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            ],
          }),
        },
      ],
    };
  },
  beforeLoad: async (ctx) => {
    const searchTerm = ctx.search.terme;

    beforeLoadCheckTerme(searchTerm);
  },
  loader: async ({ deps }) => await searchFn({ data: deps }),
  component: RouteComponent,
  errorComponent: HeaderSearchError,
});

function RouteComponent() {
  const { searchResults, searchFilterParamsJSON, searchTerm } =
    Route.useLoaderData();

  return (
    <>
      <NPSBanner />
      <BannerManager />
      <HeaderWithAdvancedSearch
        currentSearchTerm={searchTerm}
        searchParams={searchFilterParamsJSON}
        useAgentCTA={true}
        useMap={false}
        useSearchBar={true}
      />
      <main className="fr-container">
        <HiddenH1 title="Résultats de recherche" />
        <div className="content-container">
          {!hasSearchParam(searchFilterParamsJSON) && !searchTerm ? (
            <AdvancedSearchTutorial />
          ) : (
            <SearchResults
              results={searchResults}
              searchFilterParams={searchFilterParamsJSON}
              searchTerm={searchTerm}
            />
          )}
        </div>
      </main>
      <SocialNetworks />
      <Footer />
    </>
  );
}
