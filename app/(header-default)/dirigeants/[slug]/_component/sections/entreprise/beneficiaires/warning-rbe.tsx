import { INPI } from "#components/administrations";
import { Warning } from "#components-ui/alerts";

export const WarningRBE = () => (
  <Warning>
    Depuis le 31 juillet 2024, le{" "}
    <a href="/faq/registre-des-beneficiaires-effectifs">
      registre des bénéficiaires effectifs n’est plus accessible sur le site
    </a>
    , en application de la{" "}
    <a
      href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049761732"
      rel="noopener noreferrer"
      target="_blank"
    >
      directive européenne 2024/1640 du 31 mai 2024
    </a>
    . Désormais, les{" "}
    <a
      href="https://www.inpi.fr/faq/qui-peut-acceder-aux-donnees-des-beneficiaires-effectifs"
      rel="noopener noreferrer"
      target="_blank"
    >
      personnes en mesure de justifier d’un intérêt légitime
    </a>{" "}
    peuvent{" "}
    <a
      href="https://data.inpi.fr/content/editorial/acces_BE"
      rel="noopener noreferrer"
      target="_blank"
    >
      effectuer une demande d’accès
    </a>{" "}
    au registre auprès de l’
    <INPI />.
  </Warning>
);
