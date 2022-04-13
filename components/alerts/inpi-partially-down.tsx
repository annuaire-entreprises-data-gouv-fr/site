import { INPI } from '../administrations';
import Warning from './warning';

const InpiPartiallyDownWarning: React.FC<{ missing?: string }> = ({
  missing,
}) => (
  <Warning>
    Le téléservice de l’
    <INPI />, qui nous transmet les données, <b>fonctionne partiellement</b>.
    <br />
    Par conséquent il nous manque {missing || 'des données'}.<br /> Vous pouvez
    néanmoins les retrouver sur le <b>PDF justificatif d’immatriculation</b>.
  </Warning>
);

export default InpiPartiallyDownWarning;
