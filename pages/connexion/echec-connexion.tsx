import React, { ReactElement } from 'react';
import connexionFailedPicture from '#components-ui/illustrations/connexion-failed';
import ConnexionLayout from '#components/layouts/page-connexion';
import Meta from '#components/meta';
import constants from '#models/constants';
import { NextPageWithLayout } from 'pages/_app';

const ConnexionFailure: NextPageWithLayout = () => (
  <>
    <Meta title="Votre tentative de connexion a échouée" noIndex={true} />
    <h1>Votre tentative de connexion a échouée</h1>
    <p>
      Merci de réessayer plus tard. Si le problème se reproduit, merci de{' '}
      <a href={constants.links.mailto}>nous contacter.</a>
    </p>
    <a href="/">← Retourner au moteur de recherche</a>
  </>
);

ConnexionFailure.getLayout = function getLayout(page: ReactElement) {
  return <ConnexionLayout img={connexionFailedPicture}>{page}</ConnexionLayout>;
};

export default ConnexionFailure;
