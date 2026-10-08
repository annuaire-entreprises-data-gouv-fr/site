import type { ChartData, ScriptableLineSegmentContext } from "chart.js";
import type { IDVFIndicateurMensuel } from "#/models/collectivite/dvf";
import constants from "#/models/constants";

export const dvfPriceSeries = [
  {
    key: "prixMedianM2Maisons",
    label: "Maisons",
    color: constants.colors.frBlue,
  },
  {
    key: "prixMedianM2Appartements",
    label: "Appartements",
    color: constants.chartColors[4],
  },
  {
    key: "prixMedianM2Logements",
    label: "Maisons et appartements",
    color: constants.chartColors[8],
  },
  {
    key: "prixMedianM2LocauxIndustrielsCommerciaux",
    label: "Locaux industriels et commerciaux",
    color: constants.chartColors[5],
  },
] as const;

type DVFPriceKey = (typeof dvfPriceSeries)[number]["key"];

export function getDVFPriceSummary(
  timeline: IDVFIndicateurMensuel[],
  key: DVFPriceKey
) {
  const observations = timeline.filter((item) => item[key] !== null);
  const first = observations[0];
  const last = observations.at(-1);
  const firstPrice = first?.[key];
  const lastPrice = last?.[key];
  const evolution =
    observations.length >= 2 &&
    firstPrice != null &&
    firstPrice > 0 &&
    lastPrice != null
      ? ((lastPrice - firstPrice) / firstPrice) * 100
      : null;

  return { evolution, first, last };
}

function monthIndex(mois: string) {
  const [year, month] = mois.split("-").map(Number);
  return year * 12 + month - 1;
}

function monthFromIndex(index: number) {
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
}

export function buildDVFMonthlyTimeline(
  indicateurs: IDVFIndicateurMensuel[],
  monthsCount = 60
): IDVFIndicateurMensuel[] {
  if (indicateurs.length === 0) {
    return [];
  }

  const byMonth = new Map(indicateurs.map((item) => [item.mois, item]));
  const months = [...byMonth.keys()].sort();
  const lastMonth = monthIndex(months.at(-1) ?? months[0]);
  const firstMonth = Math.max(
    monthIndex(months[0]),
    lastMonth - monthsCount + 1
  );

  return Array.from({ length: lastMonth - firstMonth + 1 }, (_, index) => {
    const mois = monthFromIndex(firstMonth + index);
    return (
      byMonth.get(mois) ?? {
        mois,
        nombreVentesMaisons: null,
        nombreVentesAppartements: null,
        nombreVentesLogements: null,
        prixMedianM2Maisons: null,
        prixMedianM2Appartements: null,
        prixMedianM2Logements: null,
        prixMedianM2LocauxIndustrielsCommerciaux: null,
      }
    );
  });
}

export function dvfGapBorderDash(context: ScriptableLineSegmentContext) {
  return context.p0.skip ||
    context.p1.skip ||
    context.p1DataIndex - context.p0DataIndex > 1
    ? [5, 4]
    : undefined;
}

export function buildDVFChartData(
  timeline: IDVFIndicateurMensuel[]
): ChartData<"line" | "bar", (number | null)[], string> {
  return {
    labels: timeline.map(({ mois }) => mois),
    datasets: [
      ...dvfPriceSeries.map(({ key, label, color }) => ({
        type: "line" as const,
        label,
        data: timeline.map((item) => item[key]),
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        pointRadius: 1.5,
        pointHoverRadius: 5,
        tension: 0,
        spanGaps: true,
        segment: { borderDash: dvfGapBorderDash },
        yAxisID: "yPrix",
        order: 1,
      })),
      {
        type: "bar",
        label: "Ventes de maisons",
        data: timeline.map(({ nombreVentesMaisons }) => nombreVentesMaisons),
        backgroundColor: constants.colors.frBlue,
        yAxisID: "yVolumes",
        order: 2,
        maxBarThickness: 10,
      },
      {
        type: "bar",
        label: "Ventes d’appartements",
        data: timeline.map(
          ({ nombreVentesAppartements }) => nombreVentesAppartements
        ),
        backgroundColor: constants.chartColors[4],
        yAxisID: "yVolumes",
        order: 2,
        maxBarThickness: 10,
      },
    ],
  };
}

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

const evolutionFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

export function formatDVFPriceEvolution(value: number | null) {
  return value === null ? "—" : `${evolutionFormatter.format(value)}\u00a0%`;
}

export function formatDVFPrice(value: number | null) {
  return value === null
    ? "Non renseigné"
    : `${priceFormatter.format(value)} €/m²`;
}
