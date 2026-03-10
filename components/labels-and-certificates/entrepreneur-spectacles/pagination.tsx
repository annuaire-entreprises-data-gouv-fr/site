"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import type { IEntrepreneursSpectacles } from "#clients/api-data-gouv/entrepreneurs-spectacles/interface";
import LocalPageCounter from "#components/search-results/results-pagination/local-pagination";

export function EntrepreneurSpectaclesPagination({
  entrepreneurSpectacles,
}: {
  entrepreneurSpectacles: IEntrepreneursSpectacles;
}) {
  const [currentPage, setCurrentPage] = useQueryState(
    "entrepreneur-spectacles-page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );

  return (
    <LocalPageCounter
      compact={true}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      totalPages={Math.ceil(
        entrepreneurSpectacles.meta.total /
          entrepreneurSpectacles.meta.page_size
      )}
    />
  );
}
