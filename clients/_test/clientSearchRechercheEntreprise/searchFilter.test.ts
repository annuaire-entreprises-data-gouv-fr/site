import clientSearchRechercheEntreprise from '#clients/recherche-entreprise';
import { ISearchResults } from '#models/search';
import SearchFilterParams from '#models/search-filter-params';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';
import simplifyParams from './simplify-params';

const defaultParams = {
  searchTerms: '',
  pageResultatsRecherche: 1,
  searchFilterParams: new SearchFilterParams({}),
};

describe('clientSearchRechercheEntreprise : use of search filters', () => {
  it('Should match snapshot for collectivité territoriale', async () => {
    await expectClientToMatchSnapshot({
      client: clientSearchRechercheEntreprise,
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

  it('Should match snapshot for CA & resultat filter', async () => {
    await expectClientToMatchSnapshot({
      client: clientSearchRechercheEntreprise,
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

function postProcessResult(result: ISearchResults) {
  result.results.forEach((searchResult) => {
    searchResult.dateDerniereMiseAJour = '2023-09-21T03:34:50';
  });
}
