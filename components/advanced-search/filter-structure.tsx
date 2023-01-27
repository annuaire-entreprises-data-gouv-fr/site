import { useState } from 'react';
import { LabelAndCertificateBadge } from '#components-ui/badge/frequent';
import {
  AssociationBadge,
  CollectiviteTerritorialeBadge,
  DefaultStructureBadge,
  EntrepriseIndividuelleBadge,
} from '#components-ui/badge/frequent';
import { SimpleSeparator } from '#components-ui/horizontal-separator';

export const FilterStructure: React.FC<{
  type?: string;
  label?: string;
}> = ({ type = '', label = '' }) => {
  const [structureType, setStructureType] = useState(type);
  const [labelSelected, setLabelSelected] = useState(label);
  return (
    <>
      <label>Type de structure :</label>
      <input
        name="type"
        value={structureType}
        style={{ display: 'none' }}
        onChange={() => {}}
      />
      <div className="badge-wrapper">
        <DefaultStructureBadge
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
      <input
        name="label"
        value={labelSelected}
        style={{ display: 'none' }}
        onChange={() => {}}
      />
      <div className="badge-wrapper">
        <LabelAndCertificateBadge
          label="Tous"
          isSelected={labelSelected === ''}
          small
          onClick={() => setLabelSelected('')}
        />
        &nbsp;
        <LabelAndCertificateBadge
          label="ESS - Entreprise Sociale et Solidaire"
          isSelected={labelSelected === 'ess'}
          small
          onClick={() => setLabelSelected('ess')}
        />
        &nbsp;
        <LabelAndCertificateBadge
          label="RGE - Reconnu Garant de l’Environnement"
          isSelected={labelSelected === 'rge'}
          small
          onClick={() => setLabelSelected('rge')}
        />
        &nbsp;
        <LabelAndCertificateBadge
          label="Entrepreneur de spectacles vivants"
          isSelected={labelSelected === 'esv'}
          small
          onClick={() => setLabelSelected('esv')}
        />
      </div>
      <style jsx>{`
        .badge-wrapper {
          display: flex;
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );
};
