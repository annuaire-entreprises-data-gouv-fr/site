import { ReactElement } from 'react';
import connexionFailedPicture from '#components-ui/illustrations/connexion-failed';
import { LayoutConnexion } from '#components/layouts/layout-connexion';
import Meta from '#components/meta/meta-client';
import constants from '#models/constants';
import { NextPageWithLayout } from 'pages/_app';

const ConnexionFailure: NextPageWithLayout = () => (
  <>
    <Meta title="Votre tentative de connexion a échouée" noIndex={true} />
    <h1>Votre tentative de connexion a échouée</h1>
    <p>
      Merci de réessayer plus tard. Si le problème se reproduit, merci de{' '}
      <a href={constants.links.parcours.contact}>nous contacter.</a>
    </p>
    <a href="/">← Retourner au moteur de recherche</a>
  </>
);

ConnexionFailure.getLayout = function getLayout(page: ReactElement) {
  return <LayoutConnexion img={connexionFailedPicture}>{page}</LayoutConnexion>;
};

export default ConnexionFailure;
