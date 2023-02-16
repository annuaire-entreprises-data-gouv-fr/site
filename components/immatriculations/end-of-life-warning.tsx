import Info from '#components-ui/alerts/info';
import { INPI } from '#components/administrations';

export const RnmRncsEOLWarning = () => (
  <Info>
    A compter du 1er Janvier 2023, toutes les entreprises (commerciales,
    agricoles ou artisanales et indépendantes) doivent être{' '}
    <a
      href="https://www.inpi.fr/le-registre-national-des-entreprises"
      rel="noopener noreferer noreferrer"
      target="_blank"
    >
      immatriculées au Registre National des Entreprises
    </a>
    , opéré par l’
    <INPI />.
    <br />
    <br />
    Les section RNM et RNCS vont disparaitre dans les mois qui viennent. Vous
    retrouverez toutes leurs informations dans la section dédiée au{' '}
    <a href="#rne">Répertoire National des Entreprises (RNE)</a> situé en haut
    de page.
  </Info>
);
