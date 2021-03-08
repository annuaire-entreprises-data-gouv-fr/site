import React from 'react';

import Page from '../layouts';
import ButtonLink from '../components/button';
import constants from '../constants';

const ServerError: React.FC = () => {
  return (
    <Page small={true} title="Cette page est introuvable">
      <div className="content-container">
        <div className="layout-left">
          <h1>Oh non 😱 ! C'est la panne ⚠️</h1>
        </div>
        <p>
          Si vous voyez cette page, c'est que l'ordinateur qui fait marcher ce
          site internet a rencontré une petite panne. Pas d'inquiétude, le reste
          du site fonctionne toujours !
        </p>
        <br />
        <p>
          Écrivez-nous <a href={constants.links.mailto}>un email</a> pour nous
          expliquer comment c'est arrivé, nous vous en serions reconnaissant et
          nous ferons le nécessaire pour résoudre le problème 🕵️‍♀️.
        </p>
        <br />
        <p>En attendant, vous pouvez toujours :</p>
        <br />
        <div className="layout-left">
          <ButtonLink href="/faq" alt>
            Consulter notre page d'aide
          </ButtonLink>
          <span>&nbsp;</span>
          <ButtonLink href="/">Retourner à la page d’accueil</ButtonLink>
        </div>
      </div>
    </Page>
  );
};

export default ServerError;
