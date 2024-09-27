import routes from '#clients/routes';
import { INPI, INSEE } from '#components/administrations';
import { estNonDiffusibleStrict } from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import { Warning } from '../alerts';

const NotInSireneAlert: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  /* non-diffusible = exist in insee so following do not apply */
  if (estNonDiffusibleStrict(uniteLegale)) {
    return null;
  }

  if (uniteLegale.dateMiseAJourInsee) {
    return null;
  }

  if (!uniteLegale.dateMiseAJourInpi) {
    // does not exist in RNE either
    // should not exist in theory as UL come either from RNE or Sirene
    if (uniteLegale.dateMiseAJourIG) {
      // exist in IG !
      return (
        <Warning full>
          Cette structure{' '}
          <strong>
            n’a pas été retrouvée dans le RNE ou dans la base Sirene
          </strong>
          , où elle devrait se trouver. En revanche elle a été retrouvée sur{' '}
          <a href="https://www.infogreffe.fr/">Infogreffe</a>. C’est une
          situation <strong>très inhabituelle</strong>.
        </Warning>
      );
    }
    return null;
  }

  return (
    <Warning full>
      Cette structure <strong>n’apparait pas</strong> dans la{' '}
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
