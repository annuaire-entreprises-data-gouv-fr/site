import { PropsWithChildren } from 'react';
import { IUniteLegale } from '#models/core/types';
import AgentWall from '.';

const AgentWallAssociationProtected: React.FC<
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
        <a
          target="_blank"
          href={`https://www.data-asso.fr/annuaire/association/${uniteLegale.association.idAssociation}?docFields=documentsDac,documentsRna`}
          rel="noopener noreferrer"
        >
          la fiche data-asso
        </a>{' '}
        de cette association.
      </>
    }
  />
);

export default AgentWallAssociationProtected;
