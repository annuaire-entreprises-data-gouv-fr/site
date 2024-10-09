import connexionRefusedPicture from '#components-ui/illustrations/connexion-refused';
import { LayoutConnexion } from '#components/layouts/layout-connexion';
import Meta from '#components/meta/meta-client';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const HabilitationRequise: NextPageWithLayout = () => (
  <>
    <Meta
      title="Vous n’êtes pas autorisé(e) à accéder à l’espace agent"
      noIndex={true}
    />
    <h1>Vous n’êtes pas autorisé(e) à accéder à l’espace agent</h1>
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
      Votre organisation{' '}
      <strong>ne fait pas partie de la liste des services publics</strong>. Vous
      pouvez{' '}
      <a
        href="https://www.demarches-simplifiees.fr/commencer/7991f7ad-97d9-4bf5-a326-ae37cc858081"
        target="_blank"
        rel="noopener noreferrer"
      >
        demander l’ajout de votre organisation
      </a>{' '}
      à la liste.
    </p>
    <p>
      Si votre demande est acceptée, vous obtiendrez automatiquement l’accès à
      l’espace agent.
    </p>
    <a href="/">← Retourner au moteur de recherche</a>
  </>
);

HabilitationRequise.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutConnexion img={connexionRefusedPicture}>{page}</LayoutConnexion>
  );
};

export default HabilitationRequise;
