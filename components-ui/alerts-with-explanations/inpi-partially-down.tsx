import { INPI } from "#components/administrations";
import { Link } from "#components/Link";
import { Warning } from "../alerts";

const InpiPartiallyDownWarning = () => (
  <Warning>
    Le téléservice de l’
    <INPI />, qui nous transmet les données,{" "}
    <Link href="/donnees/api#rne">fonctionne partiellement</Link>.
    <br />
    L’information ci-dessous est la plus récente que nous ayons à notre
    disposition, elle a été récupérée auprès de l’
    <INPI /> au cours du mois passé.
  </Warning>
);

export default InpiPartiallyDownWarning;
