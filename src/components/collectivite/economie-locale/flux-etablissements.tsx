import type { ChartData } from "chart.js";
import type { IFluxOuvertureEtablissementsResponse } from "#/clients/collectivite-economie-locale/types";
import { StackedBarChart } from "#/components/chart/stack-bar";
import { DataSection } from "#/components/section/data-section";
import { EAdministration } from "#/models/administrations/e-administration";
import constants from "#/models/constants";
import { formatDatePartial, formatNumber } from "#/utils/helpers";

export function CollectiviteFluxEtablissementsSection({
  fluxEtablissements,
}: {
  fluxEtablissements: IFluxOuvertureEtablissementsResponse;
}) {
  return (
    <DataSection
      data={fluxEtablissements}
      id="economie-locale-flux-etablissements"
      lastModified={fluxEtablissements.date_mise_a_jour}
      notFoundInfo="Aucune donnée d’ouvertures et de fermetures d’établissements n’a été retrouvée pour cette commune."
      sources={[EAdministration.INSEE]}
      title="Ouvertures et fermetures d’établissements"
    >
      {({ donnees }) => {
        if (donnees.length === 0) {
          return (
            <p>
              Aucune donnée d’ouvertures et de fermetures d’établissements n’a
              été retrouvée pour cette commune.
            </p>
          );
        }

        const fluxByMonth = [...donnees].sort((left, right) =>
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
    </DataSection>
  );
}
