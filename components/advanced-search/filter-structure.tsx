import { useState } from 'react';
import {
  LabelAndCertificateBadge,
  QualiteBadge,
  ServicePublicBadge,
} from '#components-ui/badge/frequent';
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
  quality?: string;
}> = ({ type = '', label = '', quality = '' }) => {
  const [structureType, setStructureType] = useState(type);
  const [labelSelected, setLabelSelected] = useState(label);
  const [qualitySelected, setQualitySelected] = useState(quality);
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
        <ServicePublicBadge
          isSelected={structureType === 'sp'}
          small
          onClick={() => setStructureType('sp')}
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
        &nbsp;
        <LabelAndCertificateBadge
          label="Entrepreneur de spectacles vivants"
          isSelected={labelSelected === 'esv'}
          small
          onClick={() => setLabelSelected('esv')}
        />
        &nbsp;
        <LabelAndCertificateBadge
          label="Professionnels du Bio"
          isSelected={labelSelected === 'bio'}
          small
          onClick={() => setLabelSelected('bio')}
        />
        &nbsp;
        <LabelAndCertificateBadge
          label="Égalité professionnelle"
          isSelected={labelSelected === 'egapro'}
          small
          onClick={() => setLabelSelected('egapro')}
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
          label="Organisme de formation"
          isSelected={labelSelected === 'of'}
          small
          onClick={() => setLabelSelected('of')}
        />
        &nbsp;
        <LabelAndCertificateBadge
          label="Qualiopi"
          isSelected={labelSelected === 'qualiopi'}
          small
          onClick={() => setLabelSelected('qualiopi')}
        />
      </div>
      <SimpleSeparator />
      <label>Qualité :</label>
      <input
        name="quality"
        value={qualitySelected}
        type="hidden"
        onChange={() => {}}
      />
      <div className="badge-wrapper">
        <QualiteBadge
          label="Tous"
          isSelected={qualitySelected === ''}
          small
          onClick={() => setQualitySelected('')}
        />
        &nbsp;
        <QualiteBadge
          label="ESS - Économie Sociale et Solidaire"
          isSelected={qualitySelected === 'ess'}
          small
          onClick={() => setQualitySelected('ess')}
        />
        &nbsp;
        <QualiteBadge
          label="Société à mission"
          isSelected={qualitySelected === 'sm'}
          small
          onClick={() => setQualitySelected('sm')}
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
