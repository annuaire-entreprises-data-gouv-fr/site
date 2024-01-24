import { INPI } from '#components/administrations';
import Warning from './warning';

const InpiPartiallyDownWarning: React.FC<{ missing?: string }> = ({
  missing,
}) => (
  <Warning>
    Le téléservice de l’
    <INPI />, qui nous transmet les données,{' '}
    <strong>fonctionne partiellement</strong>.
    <br />
    Par conséquent il nous manque {missing || 'des données'}.<br /> Vous pouvez
    néanmoins les retrouver sur le{' '}
    <strong>PDF justificatif d’immatriculation</strong>.
  </Warning>
);

export default InpiPartiallyDownWarning;
