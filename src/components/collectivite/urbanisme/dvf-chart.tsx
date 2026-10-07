import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  type Plugin,
  PointElement,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Chart } from "react-chartjs-2";
import type { IDVFIndicateurMensuel } from "#/models/collectivite/dvf";
import { formatDatePartial, formatNumber } from "#/utils/helpers";
import { buildDVFChartData, formatDVFPrice } from "./chart-data";
import styles from "./styles.module.css";

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip
);

const monthFormatter = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});

const dvfGuidePlugin: Plugin<"line" | "bar"> = {
  id: "dvfGuide",
  afterDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    ctx.save();
    ctx.strokeStyle = "#dddddd";
    ctx.beginPath();
    ctx.moveTo(chartArea.left, scales.yVolumes.top);
    ctx.lineTo(chartArea.right, scales.yVolumes.top);
    ctx.stroke();

    const active = chart.getActiveElements()[0];
    if (active) {
      ctx.strokeStyle = "#666666";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(active.element.x, chartArea.top);
      ctx.lineTo(active.element.x, chartArea.bottom);
      ctx.stroke();
    }
    ctx.restore();
  },
};

export function DVFChart({ timeline }: { timeline: IDVFIndicateurMensuel[] }) {
  const data = useMemo(() => buildDVFChartData(timeline), [timeline]);
  const options: ChartOptions<"line" | "bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", axis: "x", intersect: false },
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          usePointStyle: true,
          pointStyle: "line",
          padding: 16,
          filter: (item, chartData) =>
            chartData.datasets[item.datasetIndex ?? 0]?.type === "line",
        },
      },
      tooltip: {
        callbacks: {
          title: (items) =>
            formatDatePartial(timeline[items[0]?.dataIndex]?.mois) ?? "",
          label(item) {
            const value = item.parsed.y;
            return `${item.dataset.label} : ${
              item.dataset.yAxisID === "yPrix"
                ? formatDVFPrice(value ?? null)
                : value == null
                  ? "Non renseigné"
                  : `${formatNumber(value)} vente(s)`
            }`;
          },
          footer(items) {
            const total = timeline[items[0]?.dataIndex]?.nombreVentesLogements;
            return total == null
              ? ""
              : `Total maisons et appartements : ${formatNumber(total)} vente(s)`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        offset: true,
        grid: { display: false },
        ticks: {
          maxRotation: 0,
          maxTicksLimit: 12,
          callback(value) {
            const mois = timeline[Number(value)]?.mois;
            return mois ? monthFormatter.format(new Date(`${mois}-01`)) : "";
          },
        },
      },
      yPrix: {
        type: "linear",
        axis: "y",
        position: "left",
        stack: "dvf",
        stackWeight: 4,
        weight: 1,
        beginAtZero: false,
        grace: "5%",
        border: { display: false },
        grid: { color: "#eeeeee" },
        ticks: {
          maxTicksLimit: 6,
          callback: (value) => formatNumber(Number(value)),
        },
        title: { display: true, text: "Prix médian (€/m²)" },
      },
      yVolumes: {
        type: "linear",
        axis: "y",
        position: "left",
        stack: "dvf",
        stackWeight: 1,
        weight: 0,
        beginAtZero: true,
        border: { display: false },
        grid: { drawOnChartArea: false },
        afterBuildTicks(scale) {
          if (scale.ticks.length === 2) {
            const midpoint = Math.round((scale.min + scale.max) / 2);
            if (midpoint > scale.min && midpoint < scale.max) {
              scale.ticks.splice(1, 0, { value: midpoint });
            }
          }
        },
        ticks: {
          autoSkip: false,
          maxTicksLimit: 3,
          precision: 0,
          callback(value) {
            // The top volume tick shares a boundary with the lowest price tick.
            return Number(value) === this.max
              ? null
              : formatNumber(Number(value));
          },
        },
        title: { display: true, text: "Ventes" },
      },
    },
  };

  return (
    <div className={styles.chart}>
      <Chart
        aria-label="Évolution mensuelle des quatre prix médians au mètre carré et des ventes de maisons et d’appartements"
        data={data}
        options={options}
        plugins={[dvfGuidePlugin]}
        role="img"
        type="line"
      />
    </div>
  );
}
