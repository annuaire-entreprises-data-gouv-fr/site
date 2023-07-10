import React from 'react';
import { ReactElement } from 'react';
import ButtonMonComptePro from '#components-ui/button-mon-compte-pro';
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
      <h1>Accédez à l’espace agent public</h1>
      <p>
        Ce service est en <Tag color="new">beta test</Tag>.
      </p>
      <p>
        Seuls les agents et agentes habilités peuvent se connecter. Si vous êtes
        intéressé(e),{' '}
        <a href="mailto:charlotte.choplin@beta.gouv.fr">
          vous pouvez nous contacter
        </a>
        .
      </p>
      <div className="layout-center">
        <ButtonMonComptePro />
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
