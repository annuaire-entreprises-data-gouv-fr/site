import { PropsWithChildren } from 'react';
import routes from '#clients/routes';
import { IUniteLegale } from '#models/core/types';
import AgentWall from '.';

const AgentWallDocuments: React.FC<
  PropsWithChildren<{
    title: string;
    id: string;
    uniteLegale: IUniteLegale;
  }>
> = ({ uniteLegale, id, title }) => (
  <AgentWall
    id={id}
    title={title}
    modalFooter={
      <>
        Les <strong>particuliers, salariés</strong> et{' '}
        <strong>entrepreneurs</strong>, peuvent consulter cette donnée sur
        l’onglet document(s) de{' '}
        <a href={routes.rne.portail.entreprise + uniteLegale.siren}>
          la page data.inpi.fr de cette entreprise
        </a>
        .
      </>
    }
  />
);

export default AgentWallDocuments;
