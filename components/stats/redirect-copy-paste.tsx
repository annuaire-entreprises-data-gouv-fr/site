import { LineChart } from '#components/chart/line';

export const RedirectAndCopyPasteChart: React.FC<{
  copyPasteAction: {
    value: number;
    label: string;
  }[];
  redirectedSiren: {
    value: number;
    label: string;
  }[];
}> = ({ redirectedSiren, copyPasteAction }) => {
  const data = {
    datasets: [
      {
        label: 'Recherche par siren',
        tension: 0.3,
        data: redirectedSiren.map((redirected) => redirected.value),
      },
      {
        label: 'Copier-coller siren / siret',
        data: copyPasteAction.map((action) => action.value),
      },
    ],
  };

  return <LineChart height={250} data={data} />;
};
