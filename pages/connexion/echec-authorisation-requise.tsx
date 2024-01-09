import { ReactElement } from 'react';
import connexionRefusedPicture from '#components-ui/illustrations/connexion-refused';
import { LayoutConnexion } from '#components/layouts/layout-connexion';
import Meta from '#components/meta';
import constants from '#models/constants';
import { NextPageWithLayout } from 'pages/_app';

const ConnexionFailure: NextPageWithLayout = () => (
  <>
    <Meta
      title="Vous n’êtes pas autorisé(e) à accéder à cette partie du site"
      noIndex={true}
    />
    <h1>Vous n’êtes pas autorisé(e) à accéder à cette partie du site</h1>
    <p>Cette espace est réservé aux agents publics habilités.</p>
    <p>
      Vous êtes agent(e) du service public et vous souhaiter accéder au
      service&nbsp;:{' '}
      <a href={constants.links.parcours.contact}>contactez-nous.</a>
    </p>
    <a href="/">← Retourner au moteur de recherche</a>
  </>
);

ConnexionFailure.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutConnexion img={connexionRefusedPicture}>{page}</LayoutConnexion>
  );
};

export default ConnexionFailure;
