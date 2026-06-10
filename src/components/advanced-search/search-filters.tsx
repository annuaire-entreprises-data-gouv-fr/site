import { useAdvancedSearchFiltersAbTest } from "#/hooks/use-ab-test";
import type { IProps } from "./search-filters-original";
import SearchFiltersOriginal from "./search-filters-original";
import SearchFiltersVariationA from "./search-filters-variation-a";
import SearchFiltersVariationB from "./search-filters-variation-b";

export function SearchFilters({ searchParams, searchTerm }: IProps) {
  const variation = useAdvancedSearchFiltersAbTest();

  console.log("variation", variation);

  if (variation === "VariationA") {
    return (
      <SearchFiltersVariationA
        searchParams={searchParams}
        searchTerm={searchTerm}
      />
    );
  }

  if (variation === "VariationB") {
    return (
      <SearchFiltersVariationB
        searchParams={searchParams}
        searchTerm={searchTerm}
      />
    );
  }

  return (
    <SearchFiltersOriginal
      searchParams={searchParams}
      searchTerm={searchTerm}
    />
  );
}
