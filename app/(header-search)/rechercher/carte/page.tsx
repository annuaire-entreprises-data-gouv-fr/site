import HiddenH1 from '#components/a11y-components/hidden-h1';
import { HeaderWithAdvancedSearch } from '#components/header/header-advanced-search';
import SearchResultsMap from '#components/search-results/map';
import StructuredDataSearchAction from '#components/structured-data/search';
import { searchWithoutProtectedSiren } from '#models/search';
import SearchFilterParams from '#models/search/search-filter-params';
import { parseIntWithDefaultValue } from '#utils/helpers';
import { AppRouterProps } from '#utils/server-side-helper/app/extract-params';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rechercher une entreprise sur la carte',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/rechercher/carte',
  },
  robots: 'noindex, nofollow',
};

export default async function MapSearchResultPage(props: AppRouterProps) {
  const searchParams = await props.searchParams;
  const searchTerm = (searchParams.terme || '') as string;
  const pageParam = (searchParams.page || '') as string;
  const page = parseIntWithDefaultValue(pageParam, 1);
  const searchFilterParams = new SearchFilterParams(searchParams);

  const results = await searchWithoutProtectedSiren(
    searchTerm,
    page,
    searchFilterParams
  );

  const searchFilterParamsJSON = searchFilterParams.toJSON();
  return (
    <>
      <HeaderWithAdvancedSearch
        useSearchBar={true}
        useAgentCTA={true}
        useMap={true}
        searchParams={searchFilterParamsJSON}
        currentSearchTerm={searchTerm}
      />
      <main style={{ maxWidth: '100%', marginBottom: 0 }} className="map">
        <StructuredDataSearchAction />
        <HiddenH1 title="Résultats de recherche" />
        <SearchResultsMap
          results={results}
          searchTerm={searchTerm}
          searchFilterParams={searchFilterParamsJSON}
        />
      </main>
    </>
  );
}
