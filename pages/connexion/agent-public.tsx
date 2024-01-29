import { ReactElement } from 'react';
import ButtonAgentConnect from '#components-ui/button-agent-connect';
import connexionPicture from '#components-ui/illustrations/connexion';
import { Tag } from '#components-ui/tag';
import { LayoutConnexion } from '#components/layouts/layout-connexion';
import Meta from '#components/meta';

const Login = () => {
  return (
    <>
      <Meta
        title="Accédez à l’espace agent public sur Annuaire des Entreprises"
        canonical="https://annuaire-entreprises.data.gouv.fr/connexion/agent-public"
        noIndex={true}
      />
      <h1>Espace agent public</h1>
      <p>
        Ce service est en <Tag color="new">beta test</Tag>.
      </p>
      <p>
        Accédez aux actes, statuts, bilans et données des entreprises
        non-diffusibles, en cliquant sur le bouton ci-dessous pour vous connecter
        :
      </p>
      <div className="layout-center">
        <ButtonAgentConnect />
      </div>
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
