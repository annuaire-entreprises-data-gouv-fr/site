import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Link } from "#/components/Link";
import PageCounter from "#/components/search-results/results-pagination";
import StructuredDataSearchAction from "#/components/structured-data/search";
import { FullTable } from "#/components/table/full";
import { Info } from "#/components-ui/alerts";
import FAQLink from "#/components-ui/faq-link";
import { SeePersonPageLink } from "#/components-ui/see-personn-page-link";
import { searchPersonCompanies } from "#/models/search";
import { meta } from "#/seo";
import {
  convertDateToAge,
  formatDatePartial,
  formatFirstNames,
  formatIntFr,
} from "#/utils/helpers";
import { isPersonneMorale } from "#/utils/helpers/is-personne-morale";
import { queryString } from "#/utils/query";
import { HeaderDefaultError } from "./-error";

const loadPersonnesPage = createServerFn()
  .inputValidator(
    z.object({
      page: z.number(),
      sirenFrom: z.string(),
      partialDate: z.string(),
      fn: z.string(),
      nom: z.string(),
    })
  )
  .handler(async ({ data: { page, sirenFrom, partialDate, fn, nom } }) => {
    const { prenom, prenoms } = formatFirstNames(fn, ", ");
    const results = await searchPersonCompanies(
      nom,
      prenom,
      prenoms,
      partialDate,
      sirenFrom,
      page
    );

    const urlComplements = `fn=${fn}&n=${nom}&partialDate=${partialDate}&sirenFrom=${sirenFrom}`;

    return { results, urlComplements, prenom, prenoms };
  });

export const Route = createFileRoute("/_header-default/personne")({
  validateSearch: z.object({
    page: z.number().min(1).optional().default(1).catch(1),
    sirenFrom: queryString.optional().default("").catch(""),
    partialDate: queryString.optional().default("").catch(""),
    fn: queryString.optional().default("").catch(""),
    nom: queryString.optional().default("").catch(""),
  }),
  search: {
    middlewares: [
      stripSearchParams({
        page: 1,
        sirenFrom: "",
        partialDate: "",
        fn: "",
        nom: "",
      }),
    ],
  },
  loaderDeps: ({ search }) => ({
    page: search.page,
    sirenFrom: search.sirenFrom,
    partialDate: search.partialDate,
    fn: search.fn,
    nom: search.nom,
  }),
  loader: async ({ deps }) => {
    const { page, sirenFrom, partialDate, fn, nom } = deps;

    return await loadPersonnesPage({
      data: { page, sirenFrom, partialDate, fn, nom },
    });
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: meta({
          title: "Page non trouvée",
          robots: {
            follow: false,
          },
        }),
      };
    }

    const { urlComplements } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/personne?${urlComplements}`;
    return {
      meta: meta({
        title: "Liste des structures associées à un individu",
        robots: {
          follow: true,
          index: false,
        },
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
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  const { results, urlComplements, prenom, prenoms } = Route.useLoaderData();
  const { sirenFrom, partialDate, nom } = Route.useSearch();

  const age = convertDateToAge(partialDate);
  const structureCountLabel =
    results.resultCount === 0 ? "Aucune" : results.resultCount;
  const plural = results.resultCount > 1 ? "s" : "";

  return (
    <div className="content-container">
      <StructuredDataSearchAction />
      {sirenFrom && (
        <Link params={{ slug: sirenFrom }} to="/dirigeants/$slug">
          ← Retourner à la page précédente
        </Link>
      )}
      <h1>
        {structureCountLabel} structure{plural} associée{plural} à {prenom}{" "}
        {nom}
        {age ? ` (${age} ans)` : ""}
      </h1>
      <p>
        <FAQLink tooltipLabel="Etat civil">
          Ceci est un état civil partiel. Il est composé du mois et de l’année
          de naissance ainsi que des prénoms et du nom. Cet état civil peut ne
          pas contenir les prénoms secondaires.
        </FAQLink>{" "}
        :{" "}
        <strong>
          {prenoms} {nom}
        </strong>
        , né(e) en {formatDatePartial(partialDate)}
      </p>
      <Info>
        Le jour de naissance n’étant pas une donnée publique et les prénoms
        secondaires n’étant pas toujours renseignés, cette page peut comporter
        de rares cas <strong>d’homonymie</strong>.
        <br />
        Si <strong>vous ne retrouvez pas une entreprise</strong> qui devrait se
        trouver dans la liste, vous pouvez effectuer une recherche{" "}
        <Link search={{ fn: prenoms, n: nom }} to="/rechercher">
          sans filtre d’âge
        </Link>{" "}
        ou{" "}
        <Link search={{ fn: prenom, n: nom }} to="/rechercher">
          sans prénom secondaire et sans filtre d’âge
        </Link>
        .
      </Info>
      <br />

      {results.results.length > 0 ? (
        <FullTable
          body={results.results.map((result) => [
            <Link params={{ slug: result.chemin }} to="/entreprise/$slug">
              {formatIntFr(result.siren)}
            </Link>,
            <>
              {result.nomComplet}
              <br />
              {result.siege.adresse}
            </>,
            <div>
              {result.dirigeants.map((dirigeantOrElu) => (
                <div>
                  {isPersonneMorale(dirigeantOrElu) ? (
                    dirigeantOrElu.siren ? (
                      <Link
                        aria-label={`Voir les dirigeants de cette entreprise (siren ${dirigeantOrElu.siren})`}
                        params={{ slug: dirigeantOrElu.siren }}
                        to="/dirigeants/$slug"
                      >
                        {dirigeantOrElu.denomination}
                      </Link>
                    ) : (
                      dirigeantOrElu.denomination
                    )
                  ) : (
                    <>
                      {dirigeantOrElu.dateNaissancePartial ? (
                        <SeePersonPageLink
                          label={`${dirigeantOrElu.prenoms} ${dirigeantOrElu.nom}`}
                          person={dirigeantOrElu}
                        />
                      ) : (
                        `${dirigeantOrElu.prenom} ${dirigeantOrElu.nom}`
                      )}
                      {!isPersonneMorale(dirigeantOrElu) &&
                      dirigeantOrElu.prenoms !== prenoms &&
                      dirigeantOrElu.prenom === prenom &&
                      dirigeantOrElu.nom.toLowerCase() === nom.toLowerCase() ? (
                        <>
                          {" "}
                          (
                          <FAQLink tooltipLabel={<i>possible homonymie</i>}>
                            Il est probable que {dirigeantOrElu.prenoms}{" "}
                            {dirigeantOrElu.nom} et {prenoms} {nom} soient la
                            même personne mais cela peut aussi être des
                            homonymes.
                          </FAQLink>
                          )
                          <br />
                        </>
                      ) : null}{" "}
                    </>
                  )}
                </div>
              ))}
            </div>,
          ])}
          head={["Siren", "Détails", "Dirigeant(s)"]}
        />
      ) : (
        <i>Aucune structure n’a été retrouvée pour cette personne.</i>
      )}

      {results.pageCount > 0 && (
        <PageCounter
          currentPage={results.currentPage}
          searchTerm=""
          totalPages={results.pageCount}
          urlComplement={`&${urlComplements}`}
        />
      )}
      <br />
    </div>
  );
}
