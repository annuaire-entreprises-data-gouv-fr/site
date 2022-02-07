import React from 'react';
import { GetServerSideProps } from 'next';

import Page from '../../layouts';
import ButtonLink from '../../components/button';
import constants from '../../models/constants';

const SirenOrSiretNotFoundPage = () => {
  return (
    <Page title="Fichier introuvable" noIndex={true}>
      <h1>Ce fichier s’est volatilisé !</h1>
      <div>
        <p>
          Si vous voyez cette page c’est que le fichier demandé n’existe plus.
          Si le problème se reproduit, merci de{' '}
          <a href={constants.links.mailto}>nous contacter.</a>.
        </p>
      </div>
      <div className="layout-center">
        <ButtonLink to="/">Retourner à l’écran d’accueil</ButtonLink>
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.statusCode = 404;
  return { props: {} };
};

export default SirenOrSiretNotFoundPage;
