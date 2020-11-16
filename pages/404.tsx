import React from 'react';

import Page from '../layouts';
import ButtonLink from '../components/button';
import constants from '../constants';

const ServerError: React.FC = () => {
  return (
    <Page small={true} title="Cette page est introuvable">
      <div className="content-container">
        <div className="layout-left">
          <h1>Cette page est introuvable 🔍</h1>
        </div>
        <p>
          Si vous êtes arrivé sur cette page en tapant une url dans la barre de rechercher, c'est probable que vous vous soyez trompé d'url.
        </p>
        <p>
          Si vous êtes arrivé sur cette page en cliquant sur un lien du site, vous pouvez <a href={constants.links.mailto}>nous contacter</a>.
        </p>
        <br   />
        <div className="layout-left">
          <ButtonLink href="/">Retourner à la page d’accueil</ButtonLink>
        </div>
      </div>
    </Page>
  );
};

export default ServerError;
