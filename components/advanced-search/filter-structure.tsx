'use client';

import {
  AssociationBadge,
  CollectiviteTerritorialeBadge,
  DefaultStructureBadge,
  EntrepriseIndividuelleBadge,
  LabelAndCertificateBadge,
  ServicePublicBadge,
} from '#components-ui/badge/frequent';
import { SimpleSeparator } from '#components-ui/horizontal-separator';
import { useState } from 'react';

export const FilterStructure: React.FC<{
  type?: string;
  label?: string;
}> = ({ type = '', label = '' }) => {
  const [structureType, setStructureType] = useState(type);
  const [labelsSelected, setLabelsSelected] = useState<string[]>(
    label ? label.split(',') : []
  );

  const toggleLabel = (labelValue: string) => {
    setLabelsSelected((prev) => {
      if (labelValue === '') {
        return [];
      }
      if (prev.includes(labelValue)) {
        return prev.filter((l) => l !== labelValue);
      }
      return [...prev, labelValue];
    });
  };

  return (
    <>
      <label className="fr-label" htmlFor="structure-type-input">
        Type de structure :
      </label>
      <input
        id="structure-type-input"
        name="type"
        value={structureType}
        type="hidden"
        onChange={() => {}}
      />
      <div className="badge-wrapper">
        <DefaultStructureBadge
          label="Tous"
          small
          onClick={() => setStructureType('')}
          isSelected={structureType === ''}
        />

        <CollectiviteTerritorialeBadge
          isSelected={structureType === 'ct'}
          small
          onClick={() => setStructureType('ct')}
        />

        <AssociationBadge
          isSelected={structureType === 'asso'}
          small
          onClick={() => setStructureType('asso')}
        />

        <ServicePublicBadge
          isSelected={structureType === 'sp'}
          small
          onClick={() => setStructureType('sp')}
        />

        <EntrepriseIndividuelleBadge
          isSelected={structureType === 'ei'}
          small
          onClick={() => setStructureType('ei')}
        />
      </div>
      <SimpleSeparator />
      <label className="fr-label" htmlFor="structure-label-input">
        Qualités, labels et certificats :
      </label>
      <input
        id="structure-label-input"
        name="label"
        value={labelsSelected.join(',')}
        type="hidden"
        onChange={() => {}}
      />
      <div className="badge-wrapper">
        <LabelAndCertificateBadge
          label="Tous"
          isSelected={labelsSelected.length === 0}
          small
          onClick={() => setLabelsSelected([])}
        />

        <LabelAndCertificateBadge
          label="ESS - Entreprise Sociale et Solidaire"
          isSelected={labelsSelected.includes('ess')}
          small
          onClick={() => toggleLabel('ess')}
        />

        {/* <LabelAndCertificateBadge
          label="Société à mission"
          isSelected={labelSelected === 'sm'}
          small
          onClick={() => setLabelSelected('sm')}
        /> */}

        <LabelAndCertificateBadge
          label="Entreprise Inclusive"
          isSelected={labelsSelected.includes('siae')}
          small
          onClick={() => toggleLabel('siae')}
        />

        <LabelAndCertificateBadge
          label="Professionnels du Bio"
          isSelected={labelsSelected.includes('bio')}
          small
          onClick={() => toggleLabel('bio')}
        />

        <LabelAndCertificateBadge
          label="Égalité professionnelle"
          isSelected={labelsSelected.includes('egapro')}
          small
          onClick={() => toggleLabel('egapro')}
        />

        <LabelAndCertificateBadge
          label="RGE - Reconnu Garant de l'Environnement"
          isSelected={labelsSelected.includes('rge')}
          small
          onClick={() => toggleLabel('rge')}
        />

        <LabelAndCertificateBadge
          label="Organisme de formation"
          isSelected={labelsSelected.includes('of')}
          small
          onClick={() => toggleLabel('of')}
        />

        <LabelAndCertificateBadge
          label="Qualiopi"
          isSelected={labelsSelected.includes('qualiopi')}
          small
          onClick={() => toggleLabel('qualiopi')}
        />

        <LabelAndCertificateBadge
          label="Entrepreneur de spectacles vivants"
          isSelected={labelsSelected.includes('esv')}
          small
          onClick={() => toggleLabel('esv')}
        />

        <LabelAndCertificateBadge
          label="Achats Responsables"
          isSelected={labelsSelected.includes('achats_responsables')}
          small
          onClick={() => toggleLabel('achats_responsables')}
        />

        <LabelAndCertificateBadge
          label="Entreprise du Patrimoine Vivant"
          isSelected={labelsSelected.includes('patrimoine_vivant')}
          small
          onClick={() => toggleLabel('patrimoine_vivant')}
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
