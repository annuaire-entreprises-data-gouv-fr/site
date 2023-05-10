import { ChangeEvent, useState } from 'react';
import { Select } from '#components-ui/select';
import { StackedBarChart } from '#components/chart/stack-bar';

export const TraficStats: React.FC<{
  visits: {
    number: number;
    label: string;
    visitReturning: number;
    visitUnknown: number;
    visitorReturning: number;
    visitorUnknown: number;
  }[];
  colors: string[];
}> = ({ visits, colors }) => {
  const [statsType, setStatsType] = useState('visit');

  const data = {
    datasets: [
      {
        label:
          statsType === 'visit'
            ? 'Nombre de visites d’utilisateurs récurrents'
            : 'Nombre d’utilisateurs récurrents',
        data: visits.map(({ label, visitorReturning, visitReturning }) => ({
          y: statsType === 'visit' ? visitReturning : visitorReturning,
          x: label,
        })),
        backgroundColor: colors[0],
      },
      {
        label:
          statsType === 'visit'
            ? 'Nombre de visites de nouveaux utilisateurs'
            : 'Nombre de nouveaux utilisateurs',
        data: visits.map(({ label, visitorUnknown, visitUnknown }) => ({
          y: statsType === 'visit' ? visitUnknown : visitorUnknown,
          x: label,
        })),
        backgroundColor: colors[1],
      },
    ],
  };

  const onOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatsType(e.target.value);
  };

  return (
    <>
      <div className="layout-right">
        <div>Afficher les données par&nbsp;</div>
        <Select
          options={[
            { value: 'visit', label: 'visites' },
            { value: 'visitors', label: 'utilisateurs' },
          ]}
          defaultValue={'visit'}
          onChange={onOptionChange}
        />
      </div>
      <div>
        <StackedBarChart data={data} />
      </div>
    </>
  );
};
