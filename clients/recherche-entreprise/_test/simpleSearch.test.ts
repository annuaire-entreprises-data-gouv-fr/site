import path from 'path';
import SearchFilterParams from '#models/search-filter-params';
import clientSearchRechercheEntreprise, { simplifyParams } from '..';

describe('clientSearchRechercheEntreprise : simple search with searchTerms', () => {
  [
    '200054781',
    '300025764',
    '351556394',
    '356000000',
    '528163777',
    '528163777',
    '839517323',
    '842019051',
    '842019051',
    '880878145',
    '88087814500015',
    '883010316',
    '908595879',
    'aga',
    'Ganymede',
    'Kikou',
    'xavier jouppe',
  ].forEach(itShouldMatchSnapshotForSearch);
});

function itShouldMatchSnapshotForSearch(searchTerms: string) {
  it(`Should match snapshot for search ${searchTerms}`, async () => {
    const args = [
      {
        page: 1,
        searchFilterParams: new SearchFilterParams({}),
        searchTerms,
      },
    ] as const;
    const result = await clientSearchRechercheEntreprise(...args);
    expect(
      JSON.stringify({ args: simplifyParams(...args), result }, null, 2)
    ).toMatchFile(path.join(__dirname, `./search-${searchTerms}.json`));
  });
}
