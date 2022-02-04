import { GetServerSideProps } from 'next';
import React from 'react';
import ButtonFranceConnect from '../../components/button-france-connect';

import Page from '../../layouts';
import { getSession } from '../../utils/session';

const Login: React.FC = () => {
  return (
    <Page
      title="Connectez-vous à votre espace entrepreneur"
      noIndex={true}
      session={null}
    >
      <h1>Connectez-vous à votre espace entrepreneur</h1>
      <p>
        En tant que dirigeant d’entreprise, accèdez aux attestations,
        justificatifs et données privées de votre entreprise.
      </p>
      <div className="france-connect-container">
        <ButtonFranceConnect />
        <div>
          <a href="Qu’est-ce que FranceConnect ?">
            Qu’est-ce que FranceConnect ?
          </a>
        </div>
      </div>
      <style jsx>{`
        h1,
        p {
          text-align: center;
        }
        .france-connect-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .france-connect-container a {
          font-size: 0.8rem;
        }
      `}</style>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context.req, context.res);

  const alreadyAuthenticated = session.passport && session.passport.user;
  const comeFromEntreprisePage = !!context.query.siren;

  // clean session navigation from any previous verification
  session.navigation = null;
  if (comeFromEntreprisePage) {
    // associate session with siren
    session.navigation = { origin: context.query.siren };
  }

  if (alreadyAuthenticated) {
    if (comeFromEntreprisePage) {
      return {
        redirect: {
          destination: `/api/verify`,
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: '/compte/mes-entreprises',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
};

export default Login;
