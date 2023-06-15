export const htmlLegendPlugin = (htmlLegendContainerId: string) => {
  return {
    id: 'htmlLegend',
    afterUpdate(chart: any) {
      const legendContainer = document.getElementById(htmlLegendContainerId);
      let listContainer = null as any;

      if (legendContainer) {
        listContainer = legendContainer.querySelector('ul');

        if (!listContainer) {
          listContainer = document.createElement('ul');
          listContainer.style.margin = '0';
          listContainer.style.padding = '0';

          legendContainer.appendChild(listContainer);
        }
      }

      if (!listContainer) {
        return;
      }

      // Remove old legend items
      while (listContainer.firstChild) {
        listContainer.firstChild.remove();
      }

      // Reuse the built-in legendItems generator
      const items = chart.options.plugins.legend.labels.generateLabels(chart);

      items.forEach((item: any) => {
        const li = document.createElement('li');
        li.style.alignItems = 'center';
        li.style.cursor = 'pointer';
        li.style.display = 'flex';
        li.style.flexDirection = 'row';
        li.style.marginLeft = '10px';

        li.onclick = () => {
          const { type } = chart.config;
          if (type === 'pie' || type === 'doughnut') {
            // Pie and doughnut charts only have a single dataset and visibility is per item
            chart.toggleDataVisibility(item.index);
          } else {
            chart.setDatasetVisibility(
              item.datasetIndex,
              !chart.isDatasetVisible(item.datasetIndex)
            );
          }
          chart.update();
        };

        // Color box
        const boxSpan = document.createElement('span');
        boxSpan.style.background = item.fillStyle;
        boxSpan.style.borderColor = item.strokeStyle;
        boxSpan.style.borderWidth = item.lineWidth + 'px';
        boxSpan.style.borderRadius = '50px';

        boxSpan.style.display = 'inline-block';
        boxSpan.style.height = '15px';
        boxSpan.style.marginRight = '10px';
        boxSpan.style.width = '15px';

        // Text
        const textContainer = document.createElement('p');
        textContainer.style.color = item.fontColor;
        textContainer.style.fontSize = '0.9rem';
        textContainer.style.margin = '0';
        textContainer.style.padding = '0';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '10px';
        checkbox.checked = !item.hidden;

        const text = document.createTextNode(item.text);
        textContainer.appendChild(text);

        li.appendChild(checkbox);
        li.appendChild(boxSpan);
        li.appendChild(textContainer);
        listContainer.appendChild(li);
      });
    },
  };
};
