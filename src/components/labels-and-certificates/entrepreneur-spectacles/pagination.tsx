import { useState } from "react";
import type { IEntrepreneursSpectacles } from "#/clients/api-data-gouv/entrepreneurs-spectacles/interface";
import LocalPageCounter from "#/components/search-results/results-pagination/local-pagination";

export function EntrepreneurSpectaclesPagination({
  entrepreneurSpectacles,
}: {
  entrepreneurSpectacles: IEntrepreneursSpectacles;
}) {
  // TODO remigrate to nuqs like query binding, needs shallow false
  const [currentPage, setCurrentPage] = useState(1);

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
