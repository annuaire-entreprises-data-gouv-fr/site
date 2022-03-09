import { INPI } from '../administrations';
import Warning from './warning';

const InpiPartiallyDownWarning = () => (
  <Warning>
    Le téléservice de l’
    <INPI />, qui nous transmet les données, est partiellement{' '}
    <b>hors service 🔴</b>.
    <br />
    Il nous manque certaines données (par exemple, le numéro RCS), mais vous
    pouvez les retrouver sur le PDF d’immatriculation.
  </Warning>
);

export default InpiPartiallyDownWarning;
