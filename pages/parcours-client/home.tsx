import { GetServerSideProps } from 'next';
import React from 'react';
import { Section } from '../../components/section';

import { ApplicationPage } from '../../layouts';
import { getSession } from '../../utils/session';

const Login: React.FC<{ name: string; firstName: string }> = ({
  name,
  firstName,
}) => {
  return (
    <ApplicationPage title="Vos entreprises">
      <h1>
        {firstName} {name}
      </h1>
      <Section title="Vos entreprises">
        <p>Vous n’avez aucune entreprise actuellement référencée.</p>
      </Section>

      <style jsx>{``}</style>
    </ApplicationPage>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context.req, context.res);

  if (!session.passport || !session.passport.user) {
    return {
      redirect: {
        destination: '/parcours-client',
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
