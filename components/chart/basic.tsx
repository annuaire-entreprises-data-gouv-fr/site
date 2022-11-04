import React from 'react';
import randomId from '../../utils/helpers/randomId';

const BasicChart: React.FC<{
  yLabel: string;
  yRange: number[];
  type: 'line' | 'bar';
  labels?: string[];
  datasets: any[];
  height?: number;
  stacked?: boolean;
  horizontal?: boolean;
}> = ({
  datasets,
  yLabel,
  yRange,
  type = 'line',
  labels,
  height = 100,
  stacked = false,
  horizontal = false,
}) => {
  const id = randomId();
  return (
    <>
      <canvas id={id} width="400" height={height}></canvas>
      <div
        dangerouslySetInnerHTML={{
          __html: `
        <script>
        const canvas${id} = document.getElementById('${id}').getContext('2d');
        const chart${id} = new Chart(canvas${id}, {
          type: '${type}',
          data: {
            ${labels ? `labels:${JSON.stringify(labels)},` : ''}
            datasets: ${JSON.stringify(datasets)}
          },
          options: {
            indexAxis: '${horizontal ? 'y' : 'x'}',
            responsive: true,
            plugins: {
              title: {
                display: false,
              },
              legend: {
                display:true,
              }
            },
            scales: {
              x: {
                display: true,
                stacked:${stacked},
                title: {
                  display: true
                }
              },
              y: {
                display: true,
                stacked:${stacked},
                title: {
                  display: true,
                  text: '${yLabel}'
                },
                suggestedMin: ${yRange[0]},
                suggestedMax: ${yRange[1]},
              }
            }
          }
        });
        </script>
        `,
        }}
      />
    </>
  );
};

export default BasicChart;
