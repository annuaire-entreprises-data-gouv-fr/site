import { GetServerSideProps } from 'next';
import React from 'react';
import { IPropsWithSession, withSession } from '../../hocs/with-session';

import Page from '../../layouts';

const Entreprises: React.FC<IPropsWithSession> = ({ session }) => {
  return (
    <Page title="Mes entreprises" noIndex={true} session={session}>
      <h1>Mes entreprises</h1>
      {JSON.stringify(session)}
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(async () => {
  return {
    props: {},
  };
});

export default Entreprises;
