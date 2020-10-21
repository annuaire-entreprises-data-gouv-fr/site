import React from 'react';

import Page from '../layouts';
import ButtonLink from '../components/button';
import constants from '../constants';

const ServerError: React.FC<{}> = () => (
  <Page small={true}>
    <div className="content-container layout-center">
      <h1>Une erreur est survenue</h1>
    </div>
    <div className="layout-center">
      <h2>
        Cela ne devrait pas arriver, mais si le problème persiste, vous pouvez
        <a href={constants.links.mailto}>nous contacter</a>.
      </h2>
    </div>
    <div className="layout-center">
      <ButtonLink href="/">Retourner à la page d’accueil</ButtonLink>
    </div>
  </Page>
);

export default ServerError;
