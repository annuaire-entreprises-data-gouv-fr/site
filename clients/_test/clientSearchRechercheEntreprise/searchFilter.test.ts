import clientSearchRechercheEntreprise from '#clients/recherche-entreprise';
import { ISearchResults } from '#models/search';
import SearchFilterParams from '#models/search-filter-params';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';
import simplifyParams from './simplify-params';

const defaultParams = {
  searchTerms: '',
  page: 1,
  searchFilterParams: new SearchFilterParams({}),
};

describe('clientSearchRechercheEntreprise : simple search with searchTerms', () => {
  it.skip('Should match snapshot for code postal', async () => {
    await expectClientToMatchSnapshot({
      client: clientSearchRechercheEntreprise,
      __dirname,
      args: [
        {
          ...defaultParams,
          searchFilterParams: new SearchFilterParams({
            cp_dep_type: 'cp',
            cp_dep: '35000',
          }),
        },
      ],
      snaphotFile: 'code-postal.json',
      simplifyParams,
      postProcessResult,
    });
  });

  it.skip('Should match snapshot for code postal with search term', async () => {
    await expectClientToMatchSnapshot({
      client: clientSearchRechercheEntreprise,
      __dirname,
      args: [
        {
          ...defaultParams,
          searchTerms: 'ag',
          searchFilterParams: new SearchFilterParams({
            cp_dep_type: 'cp',
            cp_dep: '35000',
          }),
        },
      ],
      snaphotFile: 'code-postal-with-search.json',
      simplifyParams,
      postProcessResult,
    });
  });

  it('Should match snapshot for Anne Hidalgo', async () => {
    await expectClientToMatchSnapshot({
      client: clientSearchRechercheEntreprise,
      __dirname,
      args: [
        {
          ...defaultParams,
          searchFilterParams: new SearchFilterParams({
            fn: 'anne',
            n: 'hidalgo',
          }),
        },
      ],
      snaphotFile: 'anne-hidalgo.json',
      simplifyParams,
      postProcessResult,
    });
  });

  it.skip('Should match snapshot for la poste', async () => {
    await expectClientToMatchSnapshot({
      client: clientSearchRechercheEntreprise,
      __dirname,
      args: [
        {
          ...defaultParams,
          searchTerms: 'la poste',
          searchFilterParams: new SearchFilterParams({
            cp_dep: '',
            sap: 'A',
          }),
        },
      ],
      snaphotFile: 'la-poste.json',
      simplifyParams,
      postProcessResult,
    });
  });

  it.skip('Should match snapshot for la poste page 3', async () => {
    await expectClientToMatchSnapshot({
      client: clientSearchRechercheEntreprise,
      __dirname,
      args: [
        {
          ...defaultParams,
          searchTerms: 'la poste',
          page: 3,
          searchFilterParams: new SearchFilterParams({
            cp_dep: '',
            sap: 'A',
          }),
        },
      ],
      snaphotFile: 'la-poste-page-3.json',
      simplifyParams,
      postProcessResult,
    });
  });

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
      snaphotFile: 'collectivité-territoriale.json',
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
