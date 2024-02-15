import routes from '#clients/routes';
import { INPI, INSEE } from '#components/administrations';
import { IUniteLegale } from '#models/core/types';
import { Warning } from '.';

const NotInSireneAlert: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) =>
  !uniteLegale.dateMiseAJourInsee && (
    <Warning full>
      Cette structure <b>n’apparait pas</b> dans la{' '}
      <a href="https://sirene.fr">base Sirene</a> des entreprises tenue par l’
      <INSEE />, mais elle est présente dans le Registre National des
      Entreprises ou RNE, tenu par l’
      <INPI />. C’est une situation <b>très inhabituelle</b>.
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
export default NotInSireneAlert;
