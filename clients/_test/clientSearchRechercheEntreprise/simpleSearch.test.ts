import clientSearchRechercheEntreprise from "#clients/recherche-entreprise";
import SearchFilterParams from "#models/search/search-filter-params";
import { expectClientToMatchSnapshot } from "../expect-client-to-match-snapshot";
import simplifyParams from "./simplify-params";

describe("clientSearchRechercheEntreprise : simple search with searchTerms", () => {
  [
    "198100125", // établissement scolaire
    "800329849", // entrepreneur spectacle, asso & ESS
    "130025265", // DINUM (administration)
    "217500016", // Ville de paris
    "843701079",
    "880878145",
    "88087814500015",
    "883010316",
    "908595879",
    "552032534",
    "487444697",
    "48744469700428",
    "338365059",
    "300025764",
    "351556394",
    "839517323",
    "842019051",
    "423208180",
    "383657467",
    "123456789",
    "12345678900003",
    "41154066900016",
  ].forEach((s) => itShouldMatchSnapshotForSearch(s, 1));
});

function itShouldMatchSnapshotForSearch(
  searchTerms: string,
  pageEtablissements = 1
) {
  it(`Should match snapshot for search ${searchTerms} ${
    pageEtablissements !== 1
      ? " and etablissement page " + pageEtablissements
      : ""
  }`, async () => {
    await expectClientToMatchSnapshot({
      client: clientSearchRechercheEntreprise,
      __dirname,
      args: [
        {
          pageResultatsRecherche: 1,
          inclureImmatriculation: true,
          searchFilterParams: new SearchFilterParams({}),
          searchTerms,
        },
      ],
      snapshotFile: `search-${searchTerms}${
        pageEtablissements !== 1 ? `-${pageEtablissements}` : ""
      }.json`,
      simplifyParams,
      postProcessResult: (result) => {
        result.results.forEach((searchResult) => {
          searchResult.dateDerniereMiseAJour = "2023-09-21T03:34:50";
        });
      },
    });
  });
}
