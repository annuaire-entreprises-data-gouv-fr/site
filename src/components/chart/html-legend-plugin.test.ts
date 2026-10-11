import { expect, test, vi } from "vitest";
import { htmlLegendPlugin } from "./html-legend-plugin";

test("legend toggles a dataset without replacing the focused checkbox", () => {
  document.body.innerHTML = '<div id="legend"></div>';
  let visible = true;
  const plugin = htmlLegendPlugin("legend");
  const chart = {
    config: { type: "line" },
    data: { datasets: [{}] },
    options: {
      plugins: {
        legend: {
          labels: {
            generateLabels: () => [
              { datasetIndex: 0, text: "Résultat net", hidden: !visible },
            ],
          },
        },
      },
    },
    setDatasetVisibility: vi.fn((_index, next) => {
      visible = next;
    }),
    update: () => plugin.afterUpdate(chart),
  };
  plugin.afterUpdate(chart);
  const input = document.querySelector("input");
  expect(input).not.toBeNull();
  input?.focus();
  input?.click();
  expect(chart.setDatasetVisibility).toHaveBeenCalledWith(0, false);
  expect(document.activeElement).toBe(input);
  expect(document.querySelector("input")).toBe(input);
  expect(input?.checked).toBe(false);
  expect(input?.closest("label")?.textContent).toContain("Résultat net");
  document.body.innerHTML = "";
});
