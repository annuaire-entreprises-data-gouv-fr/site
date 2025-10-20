"use client";

import { useFetchBilanGes } from "hooks/fetch/bilan-ges";
import { useState } from "react";
import LocalPageCounter from "#components/search-results/results-pagination/local-pagination";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { FullTable } from "#components/table/full";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";

type IProps = {
  uniteLegale: IUniteLegale;
};

const formatEmissions = (value: number): string => {
  if (value === 0) return "Non renseigné";
  return value.toLocaleString("fr-FR");
};

/**
 * Bilan GES section
 */
export default function BilanGesSection({ uniteLegale }: IProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const bilanGes = useFetchBilanGes(uniteLegale, currentPage);

  return (
    <AsyncDataSectionClient
      data={bilanGes}
      id="bilan-ges"
      notFoundInfo={
        <p>
          Nous n‘avons pas trouvé de bilan GES (Gaz à Effet de Serre) pour cette
          structure.
        </p>
      }
      sources={[EAdministration.ADEME]}
      title="Bilans GES (Gaz à Effet de Serre)"
    >
      {(bilanGes) => {
        const { total } = bilanGes.meta;
        const plural = total > 1 ? "s" : "";
        const pageSize = 20;

        const sortedBilans = [...bilanGes.data].sort(
          (a, b) => a.anneeReporting - b.anneeReporting
        );

        return (
          <>
            <p>
              Cette structure a publié {total} bilan{plural} GES (Gaz à Effet de
              Serre) :
            </p>

            {total > pageSize && (
              <LocalPageCounter
                compact={true}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalPages={Math.ceil(total / pageSize)}
              />
            )}

            <FullTable
              body={[
                [
                  "Total des émissions (tCO2e)",
                  ...sortedBilans.map((bilan) =>
                    formatEmissions(bilan.totalEmissions)
                  ),
                ],
              ]}
              head={[
                "Indicateur",
                ...sortedBilans.map((bilan) => bilan.anneeReporting.toString()),
              ]}
            />

            {total > pageSize && (
              <LocalPageCounter
                compact={true}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalPages={Math.ceil(total / pageSize)}
              />
            )}
          </>
        );
      }}
    </AsyncDataSectionClient>
  );
}
