import { PropsWithChildren } from 'react';
import routes from '#clients/routes';
import { IUniteLegale } from '#models/core/types';
import AgentWall from '.';

const AgentWallWrapper: React.FC<
  PropsWithChildren<{
    title: string;
    id: string;
    uniteLegale: IUniteLegale;
    condition: boolean;
  }>
> = ({ uniteLegale, id, title, condition, children }) => {
  if (condition) {
    return (
      <AgentWall
        id={id}
        title={title}
        modalFooter={
          <>
            Les <strong>particuliers, salariés</strong> et{' '}
            <strong>entrepreneurs</strong>, peuvent consulter cette donnée sur
            l’onglet document de{' '}
            <a href={routes.rne.portail.entreprise + uniteLegale.siren}>
              la page data.inpi.fr de cette entreprise
            </a>
            .
          </>
        }
      />
    );
  }
  return children;
};

export default AgentWallWrapper;
