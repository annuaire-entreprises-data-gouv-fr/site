import { GetServerSideProps } from 'next';
import React from 'react';
import ButtonFranceConnect from '../../components/button-france-connect';

import Page from '../../layouts';
import { getSession } from '../../utils/session';

const Login: React.FC = () => {
  return (
    <Page title="Cette page est introuvable" noIndex={true}>
      <h1>
        Utilisez FranceConnect pour vous connecter à votre dossier numérique
        d’entrepreneur
      </h1>
      <p>
        FranceConnect est la solution proposée par l’État pour sécuriser et
        simplifier la connexion à vos services en ligne
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

  if (session.passport && session.passport.user) {
    return {
      redirect: {
        destination: '/compte/mes-entreprises',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Login;
