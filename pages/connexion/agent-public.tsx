import { ReactElement } from 'react';
import ButtonAgentConnect from '#components-ui/button-agent-connect';
import connexionPicture from '#components-ui/illustrations/connexion';
import { Tag } from '#components-ui/tag';
import { LayoutConnexion } from '#components/layouts/layout-connexion';
import Meta from '#components/meta/meta-client';

const Login = () => {
  return (
    <>
      <Meta
        title="Accédez à votre espace agent public sur Annuaire des Entreprises"
        noIndex={true}
      />
      <h1>Espace agent public</h1>
      <p>
        Ce service est en <Tag color="new">beta test</Tag>.
      </p>
      <p>
        Accédez aux entreprises non-diffusibles, aux actes, aux statuts et aux
        bilans des entreprises, en continuant avec le bouton{' '}
        <a
          href="https://agentconnect.gouv.fr/"
          target="_blank"
          rel="noopener noreferrer"
          title="Qu’est-ce que AgentConnect ? - nouvelle fenêtre"
        >
          AgentConnect
        </a>
        .
        <p>
          Disponible pour toutes les administrations, sans création de compte.
        </p>
      </p>
      <ButtonAgentConnect useCurrentPathForRediction={false} />
      <style jsx>{`
        h1,
        p {
          text-align: left;
        }
      `}</style>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <LayoutConnexion img={connexionPicture}>{page}</LayoutConnexion>;
};

export default Login;
