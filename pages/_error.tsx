import React from 'react';

import Page from '../layouts';
import ButtonLink from '../components/button';
import constants from '../constants';
import { GetServerSideProps } from 'next';

const ServerError: React.FC<{ statusCode: number }> = ({ statusCode }) => (
  <Page small={true} title="Une erreur est survenue">
    <div className="content-container">
      <div className="layout-center">
        <h1>Une erreur est survenue</h1>
      </div>
      <div className="layout-center">
        <h2>
          Cela ne devrait pas arriver, mais si le problème persiste, vous pouvez{' '}
          <a href={constants.links.mailto}>nous contacter</a>.
        </h2>
      </div>
      <div className="layout-center">
        <ButtonLink href="/">Retourner à la page d’accueil</ButtonLink>
      </div>
    </div>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const statusCode = context.res ? context.res.statusCode : 404;
  return {
    props: {
      statusCode,
    },
  };
};


export default ServerError;
