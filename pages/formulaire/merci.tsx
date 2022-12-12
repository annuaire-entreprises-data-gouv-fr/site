import React from 'react';
import ButtonLink from '#components-ui/button';
import { Header } from '#components/header';
import constants from '#models/constants';

const Thanks: React.FC<{}> = () => {
  return (
    <div id="layout">
      <Header />
      <main>
        <div className="layout-center">
          <h1>Merci beaucoup pour votre retour 🙂 !</h1>
        </div>
        <br />
        <div className="fr-container" style={{ textAlign: 'center' }}>
          Le formulaire que vous avez rempli <b>est anonyme</b>. Si vous avez
          une demande précise, écrivez-nous un mail à{' '}
          <a href={constants.links.mailto}>{constants.links.mail}</a> et nous
          vous répondrons.
        </div>
        <br />
        <br />
        <div className="layout-center">
          <ButtonLink to="/">Retourner au moteur de recherche</ButtonLink>
        </div>
      </main>
    </div>
  );
};

export default Thanks;
