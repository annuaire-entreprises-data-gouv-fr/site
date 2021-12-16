import { GetServerSideProps } from 'next';
import React from 'react';
import { Section } from '../../components/section';

import Page from '../../layouts';
import { getSession } from '../../utils/session';

const Login: React.FC<{ name: string; firstName: string }> = ({
  name,
  firstName,
}) => {
  return (
    <Page title="Vos entreprises">
      <h1>
        {firstName} {name}
      </h1>
      <a href="/api/compte/logout">Se deconnecter</a>
      <Section title="Vos entreprises">
        <p>Vous n’avez aucune entreprise actuellement référencée.</p>

        <div className="layout-center">
          <div className="new-entreprise">
            <div className="plus">+</div>
            <div>Référencer une entreprise</div>
          </div>
        </div>
      </Section>

      <style jsx>{`
        .new-entreprise {
          background-color: #dfdff155;
          padding: 20px;
          margin: 20px;
          border-radius: 5px;
          color: #000091;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: bold;
        }
        .plus {
          font-size: 6rem;
          opacity: 0.1;
          height: 4rem;
        }
      `}</style>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context.req, context.res);

  if (!session.passport || !session.passport.user) {
    return {
      redirect: {
        destination: '/compte',
        permanent: false,
      },
    };
  }

  const {
    passport: {
      user: { given_name, family_name },
    },
  } = session;

  return {
    props: {
      name: family_name,
      firstName: (given_name || '').split(' ')[0],
    },
  };
};

export default Login;
