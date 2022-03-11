import { GetServerSideProps } from 'next';
import React from 'react';
import { withError } from '../../hocs/with-error';
import { withOnlyDirigeant } from '../../hocs/with-only-dirigeant';
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

export const getServerSideProps: GetServerSideProps = withError(
  withOnlyDirigeant(
    withSession(async () => {
      return {
        props: {},
      };
    })
  )
);

export default Entreprises;
