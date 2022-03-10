import React from 'react';
import connexionFailedPicture from '../../components/illustrations/connexion-failed';
import PageConnexion from '../../layouts/page-connexion';
import constants from '../../models/constants';

const ConnexionFailure: React.FC = () => {
  return (
    <PageConnexion
      title="Votre tentative de connexion a échouée"
      noIndex={true}
      session={null}
      img={connexionFailedPicture}
    >
      <h1>Votre tentative de connexion a échouée</h1>
      <p>
        Merci de réessayer plus tard. Si le problème se reproduit, merci de{' '}
        <a href={constants.links.mailto}>nous contacter.</a>.
      </p>
      <a href="/">← Retourner au moteur de recherche</a>
    </PageConnexion>
  );
};

export default ConnexionFailure;
