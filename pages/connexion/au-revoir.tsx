import React from 'react';
import logoutPicture from '../../components/illustrations/logout';
import PageConnexion from '../../layouts/page-connexion';

const Logout: React.FC = () => (
  <PageConnexion
    title="Vous êtes bien déconnecté(e)"
    noIndex={true}
    session={null}
    img={logoutPicture}
  >
    <h1>Vous êtes bien déconnecté(e)</h1>
    <p>Merci d’avoir visité l’espace entreprise.</p>
    <a href="/">← Revenir au moteur de recherche</a>
  </PageConnexion>
);

export default Logout;
