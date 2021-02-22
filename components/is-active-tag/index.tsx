import React from 'react';
import InformationTooltip from '../information-tooltip';
import { Tag } from '../tag';

const IsActiveTag: React.FC<{ isActive: boolean | null }> = ({ isActive }) => (
  <>
    {isActive === null ? (
      <>
        <Tag>
          Statut : données insufisantes
          <InformationTooltip>
            L'INSEE ne fournit pas les informations nécessaire pour savoir si
            cette entité est en activité ou si elle est fermée.
          </InformationTooltip>
        </Tag>
      </>
    ) : isActive ? (
      <Tag className="open">en activité</Tag>
    ) : (
      <Tag className="closed">fermé</Tag>
    )}
  </>
);

export default IsActiveTag;
