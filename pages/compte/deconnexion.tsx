import React from 'react';
import Page from '../../layouts';
import PageConnexion from '../../layouts/page-connexion';

const Logout: React.FC = () => (
  <PageConnexion
    title="Vous êtes bien deconnecté(e)"
    noIndex={true}
    session={null}
    img="/images/illustrations/logout.svg"
  >
    <h1>Vous êtes bien deconnecté(e)</h1>
    <p>Merci d’avoir visité l’espace entreprise.</p>
    <a href="/">← Revenir au moteur de recherche</a>
  </PageConnexion>
);

export default Logout;
