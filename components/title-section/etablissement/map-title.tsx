import { Tag } from '#components-ui/tag';
import IsActiveTag from '#components-ui/tag/is-active-tag';
import { IEtablissement } from '#models/core/types';
import { formatSiret } from '#utils/helpers';

export const MapTitleEtablissement: React.FC<{
  title?: string;
  etablissement: IEtablissement;
}> = ({ title, etablissement }) => (
  <div className="sub-title">
    <h2>{title || 'Information sur l’Etablissement'}</h2>
    <span
      style={{ color: '#666', fontVariant: 'small-caps', fontSize: '1.1rem' }}
    >
      établissement ‣ {formatSiret(etablissement.siret)}
    </span>
    {etablissement.estSiege && <Tag color="info">siège social</Tag>}
    <IsActiveTag
      etatAdministratif={etablissement.etatAdministratif}
      statutDiffusion={etablissement.statutDiffusion}
      since={etablissement.dateFermeture}
    />
  </div>
);
