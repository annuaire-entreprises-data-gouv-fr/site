import { ChangeEvent, useState } from 'react';
import { Select } from '#components-ui/select';
import { StackedBarChart } from '#components/chart/stack-bar';
import constants from '#models/constants';

export const TraficStats: React.FC<{
  visits: {
    number: number;
    label: string;
    visitReturning: number;
    visitUnknown: number;
    visitorReturning: number;
    visitorUnknown: number;
  }[];
}> = ({ visits }) => {
  const [statsType, setStatsType] = useState('users');

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
        backgroundColor: constants.chartColors[0],
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
        backgroundColor: constants.chartColors[1],
      },
    ],
  };

  const onOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatsType(e.target.value);
  };

  return (
    <>
      <p>
        Nous suivons à la fois le nombre d’utilisateurs et le nombre total de
        visites. <br />
        Un <strong>utilisateur</strong> est un individu qui visite l’Annuaire
        des Entreprises au moins une fois. Un utilisateur effectue donc une ou
        plusieurs <strong>visites</strong> du site.
      </p>
      <p>
        Un utilisateur qui a effectué deux visites ou plus est considéré comme
        un <strong>utilisateur récurrent</strong>. À l’inverse, un utilisateur
        qui n’a visité le site qu’une seule fois est un{' '}
        <strong>nouvel utilisateur</strong>.
      </p>
      <div className="layout-right">
        <div>Afficher les données par&nbsp;</div>
        <Select
          options={[
            { value: 'users', label: 'utilisateurs' },
            { value: 'visit', label: 'visites' },
          ]}
          defaultValue={'users'}
          onChange={onOptionChange}
        />
      </div>
      <StackedBarChart data={data} />
      <p>
        Le suivi des évolutions des visites et du nombre d’utilisateurs nous
        informe sur les tendances globales de l’utilisation du service :
      </p>
      <ul>
        <li>
          L’augmentation des <strong>nouveaux utilisateurs</strong> est un
          marqueur de la notoriété du service
        </li>
        <li>
          L’augmentation des <strong>utilisateurs récurrents</strong> (au moins
          2 visites dans le mois) est un marqueur de l’efficacité du service
        </li>
      </ul>
    </>
  );
};
