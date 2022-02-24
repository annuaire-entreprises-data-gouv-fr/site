import React from 'react';
import randomId from '../../utils/helpers/randomId';

const BasicChart: React.FC<{
  data: { x: any; y: number }[];
  labels?: string[];
  yLabel: string;
  yRange: number[];
  tooltipLabel: string;
  color: string;
  type: 'line' | 'bar' | 'doughnut';
}> = ({
  data,
  labels = [],
  yLabel,
  yRange,
  color = "#233d4d','#fe7f2d','#fcca46','#a1c181','#619b8a",
  tooltipLabel,
  type = 'line',
}) => {
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
            labels: [${labels.map((item) => JSON.stringify(item))}],
            datasets: [
              {
                label: '${tooltipLabel}',
                data: [${data.map((item) => JSON.stringify(item))}],
                backgroundColor: ['${color}'],
                borderColor: ['${color}'],
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
