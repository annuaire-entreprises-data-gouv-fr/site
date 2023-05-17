import React, { ReactElement } from 'react';
import logoutPicture from '#components-ui/illustrations/logout';
import { LayoutConnexion } from '#components/layouts/layout-connexion';
import Meta from '#components/meta';
import { NextPageWithLayout } from 'pages/_app';

const Logout: NextPageWithLayout = () => (
  <>
    <Meta title="Vous êtes bien deconnecté" noIndex={true} />
    <h1>Vous êtes bien déconnecté(e)</h1>
    <p>Merci de votre visite</p>
    <a href="/">← Revenir au moteur de recherche</a>
  </>
);

Logout.getLayout = function getLayout(page: ReactElement) {
  return <LayoutConnexion img={logoutPicture}>{page}</LayoutConnexion>;
};

export default Logout;
