import type { ChartData } from "chart.js";
import { useMemo } from "react";
import { StackedBarChart } from "#/components/chart/stack-bar";
import { DataSectionClient } from "#/components/section/data-section";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import { EAdministration } from "#/models/administrations/e-administration";
import constants from "#/models/constants";
import { getCollectiviteFluxOuvertureEtablissementsFn } from "#/server-functions/public/data-fetching/collectivites";
import { formatDatePartial, formatNumber } from "#/utils/helpers";

export function CollectiviteFluxEtablissementsSection({
  codeInsee,
}: {
  codeInsee: string;
}) {
  const input = useMemo(() => ({ codeInsee }), [codeInsee]);
  const fluxEtablissements = useServerFnData(
    getCollectiviteFluxOuvertureEtablissementsFn,
    input
  );

  return (
    <DataSectionClient
      data={fluxEtablissements}
      id="economie-locale-flux-etablissements"
      notFoundInfo="Aucune donnée d’ouvertures et de fermetures d’établissements n’a été retrouvée pour cette commune."
      sources={[EAdministration.INSEE]}
      title="Ouvertures et fermetures d’établissements"
    >
      {({ fluxEtablissements }) => {
        if (fluxEtablissements.length === 0) {
          return (
            <p>
              Aucune donnée d’ouvertures et de fermetures d’établissements n’a
              été retrouvée pour cette commune.
            </p>
          );
        }

        const fluxByMonth = [...fluxEtablissements].sort((left, right) =>
          left.mois.localeCompare(right.mois)
        );
        const chartData: ChartData<"bar", number[], string> = {
          labels: fluxByMonth.map(
            ({ mois }) => formatDatePartial(mois) ?? mois
          ),
          datasets: [
            {
              label: "Ouvertures",
              backgroundColor: constants.colors.frBlue,
              data: fluxByMonth.map(({ ouvertures }) => ouvertures),
            },
            {
              label: "Fermetures",
              backgroundColor: constants.chartColors[0],
              data: fluxByMonth.map(({ fermetures }) => fermetures),
            },
          ],
        };

        return (
          <>
            <p>
              Évolution mensuelle des ouvertures et des fermetures
              d’établissements de la commune.
            </p>
            <StackedBarChart
              data={chartData}
              height={300}
              pluginOption={{
                legend: { display: true },
                tooltip: {
                  callbacks: {
                    label(tooltipItem) {
                      return `${tooltipItem.dataset.label} : ${formatNumber(
                        tooltipItem.parsed.y ?? 0
                      )} établissement(s)`;
                    },
                  },
                },
              }}
              scales={{
                x: {
                  stacked: false,
                  title: { display: true, text: "Mois" },
                },
                y: {
                  stacked: false,
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                    callback: (value) => formatNumber(Number(value)),
                  },
                  title: {
                    display: true,
                    text: "Nombre d’établissements",
                  },
                },
              }}
            />
          </>
        );
      }}
    </DataSectionClient>
  );
}
