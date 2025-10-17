import path from "path";
import { clientSearchRechercheEntrepriseRaw } from "#clients/recherche-entreprise";
import SearchFilterParams from "#models/search/search-filter-params";

describe("Simple search with searchTerms", () => {
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
    "356000000",
    "300025764",
    "351556394",
    "839517323",
    "842019051",
    "423208180",
    "383657467",
    "400461356",
    "400485504",
    "Ganymede",
    "Kikou",
    "123456789",
    "12345678900003",
    "xavier jouppe",
    "la poste",
    "aga",
    "302474648",
    "533744991",
  ].forEach((s) => itShouldMatchSnapshot(s));
});

describe("Search with searchTerms and filters", () => {
  itShouldMatchSnapshot(
    "ag",
    new SearchFilterParams({
      cp_dep: "35000",
      cp_dep_type: "cp",
    }),
    "-cp_dep-35000-cp_dep_type-cp"
  );
  itShouldMatchSnapshot(
    "ganymede",
    new SearchFilterParams({
      ca_min: 100,
      res_max: 100_000,
    }),
    "-ca_min-100-res_max-100000"
  );
  itShouldMatchSnapshot(
    "",
    new SearchFilterParams({
      label: "rge",
      type: "ct",
    }),
    "-label-rge-type-ct"
  );
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function itShouldMatchSnapshot(
  searchTerms: string,
  searchFilterParams?: SearchFilterParams,
  suffix = ""
) {
  it(`Should match snapshot for search ${searchTerms}`, async () => {
    await delay(1000); // Delay of 1000 ms (1 second)
    const result = await clientSearchRechercheEntrepriseRaw({
      searchTerms,
      searchFilterParams,
      inclureImmatriculation: true,
    });
    expect(JSON.stringify({ searchTerms, result }, null, 2)).toMatchFile(
      path.join(__dirname, ".", `search-${searchTerms}${suffix}.json`)
    );
  });
}
