import clientSearchRechercheEntreprise from '#clients/recherche-entreprise';
import SearchFilterParams from '#models/search-filter-params';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';
import simplifyParams from './simplify-params';

describe.only('clientSearchRechercheEntreprise : simple search with searchTerms', () => {
  [
    // We use the commented lines to generate snapshots for
    // E2E testing.
    // Hovewer, we don't test them for regression because the results
    // changes often.

    '198100125', // établissement scolaire
    // '200054781',
    // '300025764',
    // '338365059',
    // '351556394',
    // '356000000', // La poste
    // '493096580',
    // '528163777',
    // '839517323', // entreprise cessée
    '800329849', // entrepreneur spectacle, asso & ESS
    '843701079',
    '880878145',
    '88087814500015',
    '883010316',
    '908595879',
    '552032534',
    // 'aga',
    // 'Ganymede',
    // 'Kikou',
    'xavier jouppe',
  ].forEach((s) => itShouldMatchSnapshotForSearch(s, 1));
  // itShouldMatchSnapshotForSearch('356000000', 1);
  // itShouldMatchSnapshotForSearch('356000000', 3);
  // itShouldMatchSnapshotForSearch('356000000', 5);
  // itShouldMatchSnapshotForSearch('356000000', 6);
  // itShouldMatchSnapshotForSearch('356000000', 7);
});

function itShouldMatchSnapshotForSearch(
  searchTerms: string,
  pageEtablissements = 1
) {
  it(`Should match snapshot for search ${searchTerms} ${
    pageEtablissements !== 1
      ? ' and etablissement page ' + pageEtablissements
      : ''
  }`, async () => {
    await expectClientToMatchSnapshot({
      client: clientSearchRechercheEntreprise,
      __dirname,
      args: [
        {
          page: 1,
          searchFilterParams: new SearchFilterParams({}),
          searchTerms,
        },
      ],
      snaphotFile: `search-${searchTerms}${
        pageEtablissements !== 1 ? `-${pageEtablissements}` : ''
      }.json`,
      simplifyParams,
      postProcessResult: (result) => {
        result.results.forEach((searchResult) => {
          searchResult.dateDerniereMiseAJour = '2023-09-21T03:34:50';
        });
      },
    });
  });
}
