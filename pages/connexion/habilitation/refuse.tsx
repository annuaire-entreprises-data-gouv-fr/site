import connexionRefusedPicture from '#components-ui/illustrations/connexion-refused';
import { LayoutConnexion } from '#components/layouts/layout-connexion';
import Meta from '#components/meta/meta-client';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const ConnexionFailure: NextPageWithLayout = () => (
  <>
    <Meta title="Accès à l’espace agent refusé" noIndex={true} />
    <h1>L’accès à l’espace agent vous est refusé</h1>
    <div>Seuls peuvent accéder à l’espace agent public :</div>
    <ul>
      <li>
        les membres d’une administration, d’une collectivité ou d’un service
        public
      </li>
      <li>
        les membres d’une organisation privée dotée d’une mission de service
        public
      </li>
    </ul>
    <p>
      Votre organisation n’est pas un service public et par conséquent, l’accès
      à l’espace agent vous est refusé.
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
