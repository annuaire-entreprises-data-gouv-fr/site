import { ChartData } from 'chart.js';
import { ChangeEvent, useMemo, useState } from 'react';
import { IMatomoStats } from '#clients/matomo';
import { Select } from '#components-ui/select';
import { LineChart } from '#components/chart/line';
import { StackedBarChart } from '#components/chart/stack-bar';
import constants from '#models/constants';

export const ScoreNpsStats: React.FC<{
  monthlyAgentNps: IMatomoStats['monthlyAgentNps'];
  monthlyUserNps: IMatomoStats['monthlyUserNps'];
}> = ({ monthlyAgentNps, monthlyUserNps }) => {
  const dataLineChart: ChartData<'line'> = {
    labels: monthlyAgentNps.map(({ label }) => label),
    datasets: [
      {
        backgroundColor: constants.chartColors[2],
        borderColor: constants.chartColors[2],
        data: monthlyUserNps.map(({ nps }) => nps || null),
        label: 'Note moyenne des utilisateurs',
        tension: 0.3,
      },
      {
        backgroundColor: constants.chartColors[4],
        borderColor: constants.chartColors[4],
        data: monthlyAgentNps.map(({ nps }) => nps || null),
        label: 'Note moyenne des agents',
        tension: 0.3,
      },
    ],
  };

  const dataStackBarChart = {
    datasets: [
      {
        label: "Pourcetage d'utilisateur",
        data: monthlyUserNps.map(({ label, npsResponses }, index) => {
          const response = npsResponses || 0;
          const agentResponse = monthlyAgentNps[index].npsResponses || 0;
          return {
            y: (response * 100) / (response + agentResponse),
            x: label,
          };
        }),
        backgroundColor: constants.chartColors[0],
      },
      {
        label: "Pourcetage d'agent",
        data: monthlyAgentNps.map(({ label, npsResponses }, index) => {
          const response = npsResponses || 0;
          const userResponse = monthlyUserNps[index].npsResponses || 0;
          return {
            y: (response * 100) / (response + userResponse),
            x: label,
          };
        }),
        backgroundColor: constants.chartColors[1],
      },
    ],
  };

  return (
    <>
      <LineChart
        data={dataLineChart}
        height={300}
        options={{
          responsive: true,
          scales: {
            y: {
              title: { display: true, text: 'Note sur 10' },
              min: 0,
              max: 10,
              ticks: { stepSize: 1 },
            },
          },
        }}
      />
      <h3>Répartition des réponses par catégorie d’utilisateurs</h3>
      <StackedBarChart
        height={300}
        data={dataStackBarChart}
        pluginOption={{
          legend: { onClick: () => undefined },
          tooltip: {
            callbacks: {
              label(context) {
                return `${context.dataset.label} ${Math.round(
                  context.parsed.y
                )}%`;
              },
            },
          },
        }}
      />
    </>
  );
};
