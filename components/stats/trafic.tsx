import { ChangeEvent, useState } from 'react';
import { IMatomoStats } from '#clients/matomo';
import { Select } from '#components-ui/select';
import { StackedBarChart } from '#components/chart/stack-bar';
import constants from '#models/constants';

type IStatType = 'agents' | 'users' | 'api';

export const TraficStats: React.FC<Partial<IMatomoStats>> = ({
  visits = [],
}) => {
  const [statsType, setStatsType] = useState<IStatType>('users');

  const data = {
    datasets:
      statsType === 'api'
        ? [
            {
              label: 'Nombre d’appels reçus par l’API Recherche d’Entreprises',
              data: visits.map(({ label, apiRequests }) => ({
                y: apiRequests,
                x: label,
              })),
              backgroundColor: constants.chartColors[1],
            },
          ]
        : [
            {
              label:
                statsType === 'agents'
                  ? 'Nombre d’agents récurrents'
                  : 'Nombre d’utilisateurs récurrents',
              data: visits.map(
                ({ label, visitorReturning, agentReturning }) => ({
                  y: statsType === 'agents' ? agentReturning : visitorReturning,
                  x: label,
                })
              ),
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
    setStatsType(e.target.value as IStatType);
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
          identifié avec{' '}
          <a
            href="https://agentconnect.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
            title="Qu’est-ce que AgentConnect ? - nouvelle fenêtre"
          >
            AgentConnect
          </a>{' '}
          pour{' '}
          <a href="https://annuaire-entreprises.data.gouv.fr/lp/agent-public">
            avoir accès à des informations additionnelles (actes, statuts, etc.)
          </a>
        </li>
      </ul>
      <p>
        Un utilisateur qui a déjà visité le site les mois précédents est un{' '}
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
            { value: 'api', label: 'appels API' },
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
      <p>
        Nous suivons également le nombre d’appels reçus par{' '}
        <a href="/donnees/api-entreprises">
          notre API de Recherche d’entreprises
        </a>
        . Ce chiffre inclut les appels provenant du site{' '}
        <b>Annuaire des Entreprises</b> et les appels externes, provenant
        d’acteurs privés ou publics.
      </p>
    </>
  );
};
