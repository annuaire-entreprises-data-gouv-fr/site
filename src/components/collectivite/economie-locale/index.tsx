import type { ChartData } from "chart.js";
import { LineChart } from "#/components/chart/line";
import { DataSectionClient } from "#/components/section/data-section";
import { EAdministration } from "#/models/administrations/e-administration";
import constants from "#/models/constants";
import { formatNumber } from "#/utils/helpers";

interface CollectiviteEconomieLocaleEffectif {
  effectif: number;
  grand_secteur_activite: string;
}

export interface CollectiviteEconomieLocaleEffectifsResponse {
  effectif_salaries: Record<string, CollectiviteEconomieLocaleEffectif[]>;
}

function sortYears(left: string, right: string) {
  const leftYear = Number(left);
  const rightYear = Number(right);

  if (Number.isFinite(leftYear) && Number.isFinite(rightYear)) {
    return leftYear - rightYear;
  }

  return left.localeCompare(right);
}

function formatEffectif(value: number | string) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return value.toString();
  }

  return formatNumber(numericValue);
}

function buildEffectifsChartData(
  effectifs: CollectiviteEconomieLocaleEffectifsResponse
): ChartData<"line", (number | null)[], string> {
  const years = Object.keys(effectifs.effectif_salaries).sort(sortYears);
  const valuesBySector = new Map<string, Map<string, number>>();

  for (const year of years) {
    for (const item of effectifs.effectif_salaries[year]) {
      const sector = item.grand_secteur_activite;

      if (!sector) {
        continue;
      }

      const valuesByYear = valuesBySector.get(sector) ?? new Map();
      valuesByYear.set(year, (valuesByYear.get(year) ?? 0) + item.effectif);
      valuesBySector.set(sector, valuesByYear);
    }
  }

  const sectors = Array.from(valuesBySector.keys()).sort((left, right) =>
    left.localeCompare(right)
  );

  return {
    labels: years,
    datasets: sectors.map((sector, index) => {
      const color = constants.chartColors[index % constants.chartColors.length];
      const valuesByYear = valuesBySector.get(sector) ?? new Map();

      return {
        backgroundColor: color,
        borderColor: color,
        data: years.map((year) => valuesByYear.get(year) ?? null),
        label: sector,
        tension: 0.3,
      };
    }),
  };
}

export function CollectiviteEconomieLocaleSection({
  effectifs,
}: {
  effectifs: CollectiviteEconomieLocaleEffectifsResponse;
}) {
  return (
    <DataSectionClient
      data={effectifs}
      id="economie-locale"
      notFoundInfo="Aucune donnée d’effectifs salariés n’a été retrouvée pour cette commune."
      sources={[EAdministration.DINUM]}
      title="Économie locale"
    >
      {(effectifs) => {
        const chartData = buildEffectifsChartData(effectifs);

        if (chartData.datasets.length === 0) {
          return (
            <p>
              Aucune donnée d’effectifs salariés n’a été retrouvée pour cette
              commune.
            </p>
          );
        }

        return (
          <>
            <p>
              Évolution des effectifs des salariés du secteur privé par grand
              secteur d’activité.
            </p>
            <LineChart
              data={chartData}
              height={250}
              htmlLegendId="collectivite-effectifs-salaries-legend"
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label(tooltipItem) {
                        if (tooltipItem.parsed.y == null) {
                          return tooltipItem.dataset.label ?? "";
                        }

                        return `${tooltipItem.dataset.label} : ${formatEffectif(
                          tooltipItem.parsed.y
                        )} salarié(s)`;
                      },
                    },
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    border: { display: false },
                    ticks: {
                      callback: (label) => formatEffectif(label),
                    },
                    title: {
                      display: true,
                      text: "Effectifs salariés",
                    },
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
