import { ChangeEvent, useState } from 'react';
import { Select } from '#components-ui/select';
import { StackedBarChart } from '#components/chart/stack-bar';
import constants from '#models/constants';

export const TraficStats: React.FC<{
  visits: {
    number: number;
    label: string;
    agentUnknown: number;
    agentReturning: number;
    visitorReturning: number;
    visitorUnknown: number;
  }[];
}> = ({ visits }) => {
  const [statsType, setStatsType] = useState<'agents' | 'users'>('users');

  const data = {
    datasets: [
      {
        label:
          statsType === 'agents'
            ? 'Nombre d’agents récurrents'
            : 'Nombre d’utilisateurs récurrents',
        data: visits.map(({ label, visitorReturning, agentReturning }) => ({
          y: statsType === 'agents' ? agentReturning : visitorReturning,
          x: label,
        })),
        backgroundColor: constants.chartColors[0],
      },
      {
        label:
          statsType === 'agents'
            ? 'Nombre de nouveaux agents'
            : 'Nombre de nouveaux utilisateurs',
        data: visits.map(({ label, visitorUnknown, agentUnknown }) => ({
          y: statsType === 'agents' ? agentUnknown : visitorUnknown,
          x: label,
        })),
        backgroundColor: constants.chartColors[1],
      },
    ],
  };

  const onOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatsType(e.target.value as 'agents' | 'users');
  };

  return (
    <>
      <p>
        Nous suivons le nombre d’<strong>utilisateurs</strong> et le nombre d’
        <strong>agents connectés</strong>.
      </p>
      <ul>
        <li>
          Un <strong>utilisateur</strong> est un individu qui visite l’Annuaire
          des Entreprises au moins une fois dans le mois.
        </li>
        <li>
          Un <strong>agent connecté</strong> est un agent public qui s’est
          identifié avec AgentConnect pour avoir accès à des informations
          additionnelles (actes, statuts, etc.)
        </li>
      </ul>
      <p>
        Un utilisateur qui a déjà visité le site les mois précédents est un un{' '}
        <strong>utilisateur récurrent</strong>. À l’inverse, un utilisateur qui
        visite le site pour la première fois est un{' '}
        <strong>nouvel utilisateur</strong>.
      </p>
      <div className="layout-right">
        <div>Afficher les données par&nbsp;</div>
        <Select
          options={[
            { value: 'users', label: 'utilisateurs' },
            { value: 'agents', label: 'agents' },
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
