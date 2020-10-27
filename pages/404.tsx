import React from 'react';

import Page from '../layouts';
import ButtonLink from '../components/button';
import constants from '../constants';

const ServerError: React.FC = () => {
  return (
    <Page small={true} title="Cette page est introuvable">
      <div className="content-container">
        <div className="layout-center">
          <h1>Cette page est introuvable</h1>
        </div>
        <div className="layout-center">
          <h2>
            Cela ne devrait pas arriver, mais si le problème persiste, vous
            pouvez <a href={constants.links.mailto}>nous contacter</a>.
          </h2>
        </div>
        <div className="layout-center">
          <ButtonLink href="/">Retourner à la page d’accueil</ButtonLink>
        </div>
      </div>
    </Page>
  );
};

export default ServerError;
