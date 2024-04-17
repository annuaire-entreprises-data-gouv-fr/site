import { Error } from '#components-ui/alerts';
import MatomoEvent from '#components/matomo-event';
import constants from '#models/constants';
import { IUniteLegale } from '#models/core/types';
import { formatIntFr } from '#utils/helpers';

export const NotAValidSirenOrSiretAlert: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  return (
    <>
      <MatomoEvent category="error" action="sirenOrSiretInvalid" name="" />
      <Error full>
        <b>
          ⚠️ Ce numéro d’identification “{formatIntFr(uniteLegale.siren)}” est
          invalide
        </b>
        <div>
          <p>
            Le numéro “{formatIntFr(uniteLegale.siren)}” ressemble à un numéro
            SIREN/SIRET par sa forme (9 chiffres pour le SIREN ou 14 chiffres
            pour le SIRET) mais il ne respecte pas{' '}
            <a
              href="https://fr.wikipedia.org/wiki/Formule_de_Luhn"
              target="_blank"
              rel="noreferrer noopener"
            >
              l’algorithme de vérification.
            </a>
          </p>
          <p>
            Nous vous invitons à la plus grande vigilance,{' '}
            <strong>car il peut s’agir d’un numéro frauduleux</strong>&nbsp;:
          </p>
          <ul>
            <li>
              Vérifiez que vous n’avez pas commis de faute de frappe en
              recopiant le numéro.
            </li>
            <li>
              Vérifiez ce numéro auprès de l’organisme ou l’entreprise qui vous
              l’a transmis.
            </li>
          </ul>
          <p>
            Si vous avez effectué ces deux vérifications et que cette page
            s’affiche toujours, vous pouvez{' '}
            <a href={constants.links.parcours.contact}>nous contacter</a>.
          </p>
        </div>
      </Error>
    </>
  );
};
