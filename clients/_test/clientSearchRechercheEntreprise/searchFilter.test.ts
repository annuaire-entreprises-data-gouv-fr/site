import path from 'path';
import SearchFilterParams from '#models/search-filter-params';
import clientSearchRechercheEntreprise, { simplifyParams } from '..';
const defaultParams = {
  searchTerms: '',
  page: 1,
  searchFilterParams: new SearchFilterParams({}),
};

describe('clientSearchRechercheEntreprise : simple search with searchTerms', () => {
  it.skip('Should match snapshot for code postal', async () => {
    const args = [
      {
        ...defaultParams,
        searchFilterParams: new SearchFilterParams({
          cp_dep_type: 'cp',
          cp_dep: '06000',
        }),
      },
    ] as const;
    const result = await clientSearchRechercheEntreprise(...args);
    expect(
      JSON.stringify({ args: simplifyParams(...args), result }, null, 2)
    ).toMatchFile(path.join(__dirname, './code-postal.json'));
  });

  it.skip('Should match snapshot for code postal with search term', async () => {
    const args = [
      {
        ...defaultParams,
        searchTerms: 'ag',
        searchFilterParams: new SearchFilterParams({
          cp_dep_type: 'cp',
          cp_dep: '35000',
        }),
      },
    ] as const;
    const result = await clientSearchRechercheEntreprise(...args);
    expect(
      JSON.stringify({ args: simplifyParams(...args), result }, null, 2)
    ).toMatchFile(path.join(__dirname, './code-postal-with-search.json'));
  });

  it('Should match snapshot for Anne Hidalgo', async () => {
    const args = [
      {
        ...defaultParams,
        searchFilterParams: new SearchFilterParams({
          fn: 'anne',
          n: 'hidalgo',
        }),
      },
    ] as const;
    const result = await clientSearchRechercheEntreprise(...args);
    expect(
      JSON.stringify({ args: simplifyParams(...args), result }, null, 2)
    ).toMatchFile(path.join(__dirname, './anne-hidalgo.json'));
  });

  it.skip('Should match snapshot for la poste', async () => {
    const args = [
      {
        ...defaultParams,
        searchTerms: 'la poste',
        searchFilterParams: new SearchFilterParams({
          cp_dep: '',
          sap: 'A',
        }),
      },
    ] as const;
    const result = await clientSearchRechercheEntreprise(...args);
    expect(
      JSON.stringify({ args: simplifyParams(...args), result }, null, 2)
    ).toMatchFile(path.join(__dirname, './la-poste.json'));
  });

  it.skip('Should match snapshot for la poste page 3', async () => {
    const args = [
      {
        ...defaultParams,
        searchTerms: 'la poste',
        page: 3,
        searchFilterParams: new SearchFilterParams({
          cp_dep: '',
          sap: 'A',
        }),
      },
    ] as const;
    const result = await clientSearchRechercheEntreprise(...args);
    expect(
      JSON.stringify({ args: simplifyParams(...args), result }, null, 2)
    ).toMatchFile(path.join(__dirname, './la-poste-page-3.json'));
  });

  it('Should match snapshot for collectivité territoriale', async () => {
    const args = [
      {
        ...defaultParams,
        searchFilterParams: new SearchFilterParams({
          label: 'rge',
          type: 'ct',
        }),
      },
    ] as const;
    const result = await clientSearchRechercheEntreprise(...args);
    expect(
      JSON.stringify({ args: simplifyParams(...args), result }, null, 2)
    ).toMatchFile(path.join(__dirname, './collectivité-territoriale.json'));
  });

  it('Should match snapshot for CA & resultat filter', async () => {
    const args = [
      {
        ...defaultParams,
        searchTerms: 'ganymede',
        searchFilterParams: new SearchFilterParams({
          ca_min: 100,
          res_max: 100000,
        }),
      },
    ] as const;
    const result = await clientSearchRechercheEntreprise(...args);
    expect(
      JSON.stringify({ args: simplifyParams(...args), result }, null, 2)
    ).toMatchFile(path.join(__dirname, './CA-resultat-filter.json'));
  });
});
