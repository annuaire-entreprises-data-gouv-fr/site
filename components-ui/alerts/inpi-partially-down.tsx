import { INPI } from '#components/administrations';
import Warning from './warning';

const InpiPartiallyDownWarning = () => (
  <Warning>
    Le téléservice de l’
    <INPI />, qui nous transmet les données,{' '}
    <strong>fonctionne partiellement</strong>.
    <br />
    L’information ci-dessous est la plus récente que nous ayons à notre
    disposition, elle a été récupérée auprès de l’
    <INPI /> au cours du mois passé.
  </Warning>
);

export default InpiPartiallyDownWarning;
