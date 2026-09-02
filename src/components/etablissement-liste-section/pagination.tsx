import { getRouteApi } from "@tanstack/react-router";
import { useCallback } from "react";
import LocalPageCounter from "#/components/search-results/results-pagination/local-pagination";

const entrepriseLayout = getRouteApi("/entreprise/$slug/");

export function EtablissementListeSectionPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const navigate = entrepriseLayout.useNavigate();

  const onPageChange = useCallback(
    (page: number) => {
      navigate({
        hashScrollIntoView: true,
        hash: "etablissements",
        search: (prev) => ({ ...prev, "etablissments-page": page }),
      });
    },
    [navigate]
  );

  return (
    <LocalPageCounter
      compact={true}
      currentPage={currentPage}
      onPageChange={onPageChange}
      totalPages={totalPages}
    />
  );
}
