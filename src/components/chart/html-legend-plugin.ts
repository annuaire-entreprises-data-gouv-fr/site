export const htmlLegendPlugin = (htmlLegendContainerId: string) => ({
  id: "htmlLegend",
  afterUpdate(chart: any) {
    const container = document.getElementById(htmlLegendContainerId);
    if (!container) {
      return;
    }
    let fieldset = container.querySelector("fieldset");
    if (!fieldset) {
      fieldset = document.createElement("fieldset");
      fieldset.style.border = "none";
      const legend = document.createElement("legend");
      legend.textContent = "Indicateurs affichés dans le graphique";
      fieldset.appendChild(legend);
      container.appendChild(fieldset);
    }
    const items = chart.options.plugins.legend.labels.generateLabels(chart);
    const keys = new Set<string>();
    for (const item of items) {
      const isSingleDataset =
        chart.config.type === "pie" || chart.config.type === "doughnut";
      const key = String(isSingleDataset ? item.index : item.datasetIndex);
      keys.add(key);
      let label = fieldset.querySelector<HTMLLabelElement>(
        `label[data-key="${key}"]`
      );
      if (!label) {
        label = document.createElement("label");
        label.dataset.key = key;
        label.style.display = "flex";
        label.style.alignItems = "center";
        label.style.gap = "10px";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const swatch = document.createElement("span");
        swatch.setAttribute("aria-hidden", "true");
        const text = document.createElement("span");
        label.append(checkbox, swatch, text);
        fieldset.appendChild(label);
      }
      const checkbox = label.querySelector("input");
      if (!checkbox) {
        continue;
      }
      checkbox.checked = !item.hidden;
      checkbox.onchange = () => {
        if (isSingleDataset) {
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(item.datasetIndex, checkbox.checked);
        }
        chart.update();
      };
      const swatch = label.children[1] as HTMLElement;
      swatch.style.color = item.strokeStyle;
      const dataset = chart.data?.datasets[item.datasetIndex];
      swatch.textContent =
        dataset?.pointStyle === "triangle"
          ? "▲"
          : dataset?.pointStyle === "rectRot"
            ? "◆"
            : "●";
      label.children[2].textContent = item.text;
    }
    for (const label of fieldset.querySelectorAll<HTMLLabelElement>(
      "label[data-key]"
    )) {
      if (!keys.has(label.dataset.key ?? "")) {
        label.remove();
      }
    }
  },
});
