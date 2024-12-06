import { clientSearchRechercheEntrepriseRaw } from '#clients/recherche-entreprise';
import SearchFilterParams from '#models/search/search-filter-params';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';
import simplifyParams from './simplify-params';

describe('clientSearchRechercheEntreprise : simple search with searchTerms', () => {
  [
    // We use the commented lines to generate snapshots for
    // E2E testing.
    // Hovewer, we don't test them for regression because the results
    // changes often.
    '198100125', // établissement scolaire
    '800329849', // entrepreneur spectacle, asso & ESS
    '130025265', // DINUM (service public)
    '217500016', // Ville de paris
    '843701079',
    '880878145',
    '88087814500015',
    '883010316',
    '908595879',
    '552032534',
    '487444697',
    '48744469700428',
    '338365059',
    '356000000',
    '300025764',
    '351556394',
    '839517323',
    '842019051',
    '423208180',
    '383657467',
    'Ganymede',
    'Kikou',
    '123456789',
    '12345678900003',
    '41154066900016', // Not used in E2E tests. Entreprise non enregistrée dans la base sirene.
    'xavier jouppe',
    'la poste',
    'aga',
    'ag',
    '302474648',
    '533744991',
  ].forEach((s) => itShouldMatchSnapshotForSearch(s, 1));
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
      client: clientSearchRechercheEntrepriseRaw,
      __dirname,
      args: [
        {
          pageResultatsRecherche: 1,
          inclureImmatriculation: true,
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
          // @ts-ignore
          searchResult.dateDerniereMiseAJour = '2023-09-21T03:34:50';
        });
      },
    });
  });
}
