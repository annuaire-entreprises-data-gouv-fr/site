import connexionRefusedPicture from '#components-ui/illustrations/connexion-refused';
import { LayoutConnexion } from '#components/layouts/layout-connexion';
import Meta from '#components/meta/meta-client';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const ConnexionFailure: NextPageWithLayout = () => (
  <>
    <Meta
      title="Vous n’êtes pas autorisé(e) à accéder à cette partie du site"
      noIndex={true}
    />
    <h1>Vous n’êtes pas autorisé(e) à accéder à cette partie du site</h1>
    <p>
      Votre compte ProConnect doit être habilité pour être utilisé sur ce site.
    </p>
    <p>
      Vous souhaitez obtenir l‘habilitation&nbsp;:{' '}
      <a
        href="https://www.demarches-simplifiees.fr/commencer/7991f7ad-97d9-4bf5-a326-ae37cc858081"
        target="_blank"
        rel="noopener noreferrer"
      >
        remplissez ce formulaire
      </a>
      .
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
