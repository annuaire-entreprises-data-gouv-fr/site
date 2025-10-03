import MatomoEvent from "#components/matomo-event";
import { Error } from "#components-ui/alerts";
import type { IUniteLegale } from "#models/core/types";
import { formatIntFr, isLuhnValid } from "#utils/helpers";

export const NotLuhnValidAlert: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  if (isLuhnValid(uniteLegale.siren)) {
    return null;
  }

  return (
    <>
      <MatomoEvent action="sirenOrSiretInvalid" category="error" name="" />
      <Error full>
        Ce numéro d’identification “{formatIntFr(uniteLegale.siren)}”{" "}
        <strong>ne respecte pas</strong>{" "}
        <a
          aria-label="Voir les explications de l'algorithme de vérification, nouvelle fenêtre"
          href="https://fr.wikipedia.org/wiki/Formule_de_Luhn"
          rel="noreferrer noopener"
          target="_blank"
        >
          l’algorithme de vérification
        </a>{" "}
        des numéros SIREN/SIRET. C’est une situation{" "}
        <strong>très inhabituelle</strong> et nous vous invitons à considérer
        les informations sur cette page avec vigilance.
      </Error>
    </>
  );
};
