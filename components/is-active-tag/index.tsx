import React from 'react';
import InformationTooltip from '../information-tooltip';
import { Tag } from '../tag';

const IsActiveTag: React.FC<{
  isActive: boolean | null;
  isUniteLegale?: boolean;
}> = ({ isActive, isUniteLegale = false }) => (
  <>
    {isActive === null ? (
      <InformationTooltip
        label="Nous n’avons pas les
            informations nécessaires pour savoir si cette entité est en activité
            ou si elle est fermée."
      >
        <Tag className="unknown">Etat inconnu</Tag>
      </InformationTooltip>
    ) : isActive ? (
      <Tag className="open">en activité</Tag>
    ) : (
      <Tag className="closed">{isUniteLegale ? 'cessée' : 'fermé'}</Tag>
    )}
  </>
);

export default IsActiveTag;
