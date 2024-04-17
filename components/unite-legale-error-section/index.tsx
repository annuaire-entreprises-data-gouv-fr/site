import { NotAValidSirenOrSiretAlert } from '#components-ui/alerts-with-explanations/not-a-valid-siren-or-siret';
import NotInSireneAlert from '#components-ui/alerts-with-explanations/not-in-sirene-alert';
import MatomoEvent from '#components/matomo-event';
import { IUniteLegale } from '#models/core/types';
import { isNotFound, isNotLuhnValid } from '#models/core/unite-legale-errors';
import { formatIntFr } from '#utils/helpers';

type IProp = {
  /**
   * The unite legale
   */
  uniteLegale: IUniteLegale;
};

export async function UniteLegaleErrorSection({ uniteLegale }: IProp) {
  if (isNotFound(uniteLegale)) {
    return (
      <>
        <h1>
          <a href={`/entreprise/${uniteLegale.siren}`}>
            {formatIntFr(uniteLegale.siren)}
          </a>{' '}
          : ce numéro est introuvable 🔍
        </h1>
        <MatomoEvent category="error" action="sirenOrSiretNotFound" name="" />
        <br />
        <div>
          <p>Il existe plusieurs explications possibles :</p>
          <ul>
            <li>
              Vous avez peut-être commis une erreur en tapant votre numéro
              SIREN/SIRET et celui-ci n’existe pas
            </li>
            <li>
              Ce numéro fait peut-être référence à une structure{' '}
              <a href="/faq">non-diffusible</a>.
            </li>
            <li>
              Ce numéro fait peut-être référence à une structure publique dont
              les informations sont protégées (Ministère de Défense,
              Gendarmerie, parlementaire etc.)
            </li>
            <li>
              Ce numéro fait référence à une structure créée récemment et{' '}
              <a href="/faq">nos informations ne sont pas encore à jour</a>.
            </li>
          </ul>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>
        <a href={`/entreprise/${uniteLegale.siren}`}>
          {formatIntFr(uniteLegale.siren)}
        </a>
      </h1>
      <NotInSireneAlert uniteLegale={uniteLegale} />
      {isNotLuhnValid(uniteLegale) && (
        <NotAValidSirenOrSiretAlert uniteLegale={uniteLegale} />
      )}
    </>
  );
}
