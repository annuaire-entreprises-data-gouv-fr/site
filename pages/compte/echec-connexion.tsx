import React from 'react';
import ButtonLink from '../../components/button';
import Page from '../../layouts';
import constants from '../../models/constants';

const ConnexionFailure: React.FC = () => {
  return (
    <Page
      title="Echec de la tentative de connexion"
      noIndex={true}
      session={null}
    >
      <h1>Votre tentative de connexion a échouée.</h1>
      <p>
        Merci de réessayer plus tard. Si le problème se reproduit, merci de{' '}
        <a href={constants.links.mailto}>nous contacter.</a>.
      </p>
      <div className="layout-center">
        <ButtonLink to="/">Retourner à la recherche</ButtonLink>
      </div>
      <style jsx>{`
        h1,
        p {
          text-align: center;
        }
      `}</style>
    </Page>
  );
};
export default ConnexionFailure;
