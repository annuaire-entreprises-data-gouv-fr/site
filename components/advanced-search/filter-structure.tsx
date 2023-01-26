import { useState } from 'react';
import { SimpleSeparator } from '#components-ui/horizontal-separator';
import { Select } from '#components-ui/select';
import {
  AssociationBadge,
  CollectiviteTerritorialeBadge,
  DefaultBadge,
  EntrepriseIndividuelleBadge,
} from '#components/unite-legale-badge';

export const FilterStructure: React.FC<{
  type?: string;
  label?: string;
}> = ({ type = '', label = '' }) => {
  const [structureType, setStructureType] = useState(type);
  return (
    <>
      <label>Type de structure :</label>
      <input
        name="type"
        value={structureType}
        style={{ display: 'none' }}
        onChange={() => {}}
      />
      <div className="type-structure">
        <DefaultBadge
          label="Tous"
          small
          onClick={() => setStructureType('')}
          isSelected={structureType === ''}
        />
        &nbsp;
        <CollectiviteTerritorialeBadge
          isSelected={structureType === 'ct'}
          small
          onClick={() => setStructureType('ct')}
        />
        &nbsp;
        <AssociationBadge
          isSelected={structureType === 'asso'}
          small
          onClick={() => setStructureType('asso')}
        />
        &nbsp;
        <EntrepriseIndividuelleBadge
          isSelected={structureType === 'ei'}
          small
          onClick={() => setStructureType('ei')}
        />
      </div>
      <SimpleSeparator />
      <label>Labels et certificats :</label>
      <Select
        options={[
          { value: 'rge', label: 'RGE - Reconnu Garant de l’Environnement' },
          { value: 'ess', label: 'ESS - Economie Sociale et Solidaire' },
          { value: 'esv', label: 'Entreprise du Spectacle Vivant' },
        ]}
        name="label"
        defaultValue={label}
        placeholder="Choisir un label ou un certificat"
      />
      <style jsx>{`
        .type-structure {
          display: flex;
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );
};
