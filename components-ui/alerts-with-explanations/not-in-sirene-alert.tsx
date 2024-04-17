import routes from '#clients/routes';
import { INPI, INSEE } from '#components/administrations';
import { estNonDiffusible } from '#models/core/statut-diffusion';
import { IUniteLegale } from '#models/core/types';
import { Warning } from '../alerts';

const NotInSireneAlert: React.FC<{
  uniteLegale: IUniteLegale;
  pronoun?: string;
}> = ({ uniteLegale, pronoun = 'Cette structure' }) => {
  /* non-diffusible = exist in insee so following do not apply */
  if (estNonDiffusible(uniteLegale)) {
    return null;
  }

  if (uniteLegale.dateMiseAJourInsee) {
    return null;
  }

  if (!uniteLegale.dateMiseAJourInpi) {
    // does not exist in RNE either
    return null;
  }

  return (
    <Warning full>
      {pronoun} <strong>n’apparait pas</strong> dans la{' '}
      <a href="https://sirene.fr">base Sirene</a> des entreprises tenue par l’
      <INSEE />, mais elle est présente dans le Registre National des
      Entreprises ou RNE, tenu par l’
      <INPI />. C’est une situation <strong>très inhabituelle</strong>.
      <br />
      <br />
      Retrouvez plus d&apos;informations sur la{' '}
      <a
        href={routes.rne.portail.entreprise + uniteLegale.siren}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Voir la page de cette structure sur data.inpi.fr, nouvelle fenêtre"
      >
        fiche data.inpi.fr
      </a>
      .
    </Warning>
  );
};

export default NotInSireneAlert;
