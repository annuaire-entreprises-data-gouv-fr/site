import { getRouteApi } from "@tanstack/react-router";
import { useCallback } from "react";
import type { IEntrepreneursSpectacles } from "#/clients/api-data-gouv/entrepreneurs-spectacles/interface";
import LocalPageCounter from "#/components/search-results/results-pagination/local-pagination";

const entrepreneurSpectaclesRoute = getRouteApi(
  "/_header-default/labels-certificats/$slug"
);

export function EntrepreneurSpectaclesPagination({
  entrepreneurSpectacles,
}: {
  entrepreneurSpectacles: IEntrepreneursSpectacles;
}) {
  const { "entrepreneur-spectacles-page": currentPage } =
    entrepreneurSpectaclesRoute.useSearch();
  const navigate = entrepreneurSpectaclesRoute.useNavigate();

  const onPageChange = useCallback(
    (page: number) => {
      navigate({
        resetScroll: false,
        search: (prev) => ({ ...prev, "entrepreneur-spectacles-page": page }),
      });
    },
    [navigate]
  );

  return (
    <LocalPageCounter
      compact={true}
      currentPage={currentPage}
      onPageChange={onPageChange}
      totalPages={Math.ceil(
        entrepreneurSpectacles.meta.total /
          entrepreneurSpectacles.meta.page_size
      )}
    />
  );
}
