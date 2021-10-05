import React from 'react';
import ButtonLink from '../components/button';

import Page from '../layouts';

const TooManyRequest: React.FC = () => {
  return (
    <Page small={true} title="Accès refusé">
      <h1>Accès refusé</h1>
      <p>
        Notre algorithme de détection pense que vous êtes un robot. Par
        conséquent, l’accès à cette page vous est refusé. <br />
        Si c’est une erreur, merci de nous contacter au plus vite via notre FAQ.
      </p>
      <div className="layout-left">
        <ButtonLink to="/faq" alt>
          Accéder à la FAQ
        </ButtonLink>
        <span>&nbsp;</span>
        <ButtonLink to="/">Retourner à la page d’accueil</ButtonLink>
      </div>
    </Page>
  );
};

export default TooManyRequest;
