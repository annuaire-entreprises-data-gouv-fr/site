import React from 'react';
import randomId from '../../utils/helpers/randomId';

const BasicChart: React.FC<{
  data: { x: any; y: number }[];
  yLabel: string;
  yRange: number[];
  tooltipLabel: string;
  color: string;
  type: 'line' | 'bar';
}> = ({ data, yLabel, yRange, color, tooltipLabel, type = 'line' }) => {
  const id = randomId();
  return (
    <>
      <canvas id={id} width="400" height="150"></canvas>
      <div
        dangerouslySetInnerHTML={{
          __html: `
        <script>
        const canvas${id} = document.getElementById('${id}').getContext('2d');
        const chart${id} = new Chart(canvas${id}, {
          type: '${type}',
          data: {
            datasets: [
              {
                label: '${tooltipLabel}',
                data: [${data.map((item) => JSON.stringify(item))}],
                backgroundColor: '${color || '#0078f3'}',
                borderColor: '${color || '#0078f3'}',
                cubicInterpolationMode: 'monotone',
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: false,
              },
              legend: {
                display:false,
              }
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true
                }
              },
              y: {
                display: true,
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
