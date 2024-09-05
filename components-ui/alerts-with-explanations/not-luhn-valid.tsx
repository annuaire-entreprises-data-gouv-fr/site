import { Error } from '#components-ui/alerts';
import MatomoEvent from '#components/matomo-event';
import { IUniteLegale } from '#models/core/types';
import { formatIntFr, isLuhnValid } from '#utils/helpers';

export const NotLuhnValidAlert: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  if (isLuhnValid(uniteLegale.siren)) {
    return null;
  }

  return (
    <>
      <MatomoEvent category="error" action="sirenOrSiretInvalid" name="" />
      <Error full>
        Ce numéro d’identification “{formatIntFr(uniteLegale.siren)}”{' '}
        <strong>ne respecte pas</strong>{' '}
        <a
          href="https://fr.wikipedia.org/wiki/Formule_de_Luhn"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Voir les explications de l'algorithme de vérification, nouvelle fenêtre"
        >
          l’algorithme de vérification
        </a>{' '}
        des numéros SIREN/SIRET. C’est une situation{' '}
        <strong>très inhabituelle</strong> et nous vous invitons à considérer
        les informations sur cette page avec vigilance.
      </Error>
    </>
  );
};
