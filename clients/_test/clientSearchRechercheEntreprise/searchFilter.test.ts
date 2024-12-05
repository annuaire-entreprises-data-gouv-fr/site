import { clientSearchRechercheEntrepriseRaw } from '#clients/recherche-entreprise';
import { ISearchResponse } from '#clients/recherche-entreprise/interface';
import SearchFilterParams from '#models/search/search-filter-params';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';
import simplifyParams from './simplify-params';

const defaultParams = {
  searchTerms: '',
  pageResultatsRecherche: 1,
  searchFilterParams: new SearchFilterParams({}),
};

// Not used in E2E tests.
describe('clientSearchRechercheEntreprise : use of search filters', () => {
  it('Should match snapshot for collectivité territoriale', async () => {
    await expectClientToMatchSnapshot({
      client: clientSearchRechercheEntrepriseRaw,
      __dirname,
      args: [
        {
          ...defaultParams,
          searchFilterParams: new SearchFilterParams({
            label: 'rge',
            type: 'ct',
          }),
        },
      ],
      snaphotFile: 'colter.json',
      simplifyParams,
      postProcessResult,
    });
  });

  // Not used in E2E tests.
  it('Should match snapshot for CA & resultat filter', async () => {
    await expectClientToMatchSnapshot({
      client: clientSearchRechercheEntrepriseRaw,
      __dirname,
      args: [
        {
          ...defaultParams,
          searchTerms: 'ganymede',
          searchFilterParams: new SearchFilterParams({
            ca_min: 100,
            res_max: 100000,
          }),
        },
      ],
      snaphotFile: 'CA-resultat-filter.json',
      simplifyParams,
      postProcessResult,
    });
  });
});

it('Should match snapshot for term < 3 and filters', async () => {
  await expectClientToMatchSnapshot({
    client: clientSearchRechercheEntrepriseRaw,
    __dirname,
    args: [
      {
        ...defaultParams,
        searchTerms: 'ag',
        searchFilterParams: new SearchFilterParams({
          cp_dep: '35000',
          cp_dep_type: 'cp',
        }),
      },
    ],
    snaphotFile: 'ag.json',
    simplifyParams,
    postProcessResult,
  });
});

function postProcessResult(result: ISearchResponse) {
  result.results.forEach((searchResult) => {
    // @ts-ignore
    searchResult.dateDerniereMiseAJour = '2024-09-21T03:34:50';
    // @ts-ignore
    searchResult.dateMiseAJourInpi = '2024-09-21T03:34:50';
  });
}
