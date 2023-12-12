import { useState } from 'react';
import {
  AssociationBadge,
  CollectiviteTerritorialeBadge,
  DefaultStructureBadge,
  EntrepriseIndividuelleBadge,
  LabelAndCertificateBadge,
  ServicePublicBadge,
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
      <label>Qualités, labels et certificats :</label>
      <input
        name="label"
        value={labelSelected}
        type="hidden"
        onChange={() => {}}
      />
      <div className="badge-wrapper">
        <LabelAndCertificateBadge
          label="Tous"
          isSelected={labelSelected === ''}
          small
          onClick={() => setLabelSelected('')}
        />

        <LabelAndCertificateBadge
          label="ESS - Entreprise Sociale et Solidaire"
          isSelected={labelSelected === 'ess'}
          small
          onClick={() => setLabelSelected('ess')}
        />

        <LabelAndCertificateBadge
          label="Société à mission"
          isSelected={labelSelected === 'sm'}
          small
          onClick={() => setLabelSelected('sm')}
        />

        <LabelAndCertificateBadge
          label="Professionnels du Bio"
          isSelected={labelSelected === 'bio'}
          small
          onClick={() => setLabelSelected('bio')}
        />

        <LabelAndCertificateBadge
          label="Égalité professionnelle"
          isSelected={labelSelected === 'egapro'}
          small
          onClick={() => setLabelSelected('egapro')}
        />

        <LabelAndCertificateBadge
          label="RGE - Reconnu Garant de l’Environnement"
          isSelected={labelSelected === 'rge'}
          small
          onClick={() => setLabelSelected('rge')}
        />

        <LabelAndCertificateBadge
          label="Organisme de formation"
          isSelected={labelSelected === 'of'}
          small
          onClick={() => setLabelSelected('of')}
        />

        <LabelAndCertificateBadge
          label="Qualiopi"
          isSelected={labelSelected === 'qualiopi'}
          small
          onClick={() => setLabelSelected('qualiopi')}
        />

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
