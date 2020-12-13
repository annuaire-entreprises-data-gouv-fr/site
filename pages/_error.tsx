import React from 'react';

import Page from '../layouts';
import ButtonLink from '../components/button';
import constants from '../constants';
import { GetServerSideProps } from 'next';
import { logErrorInSentry } from '../utils/sentry';

const ServerError: React.FC<{ statusCode: number }> = () => (
  <Page small={true} title="Une erreur est survenue">
    <div className="content-container">
      <div className="layout-left">
        <h1>Une erreur est survenue 🤭</h1>
      </div>
      <p>
        Notre équipe a été notifiée et est en train de chercher la cause de
        cette erreur afin qu'elle ne se reproduise plus.
      </p>
      <p>
        Si le problème persiste, vous pouvez{' '}
        <a href={constants.links.mailto}>nous contacter</a>.
      </p>
      <br />
      <div className="layout-left">
        <ButtonLink href="/">Retourner à la page d’accueil</ButtonLink>
      </div>
    </div>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const statusCode = context.res ? context.res.statusCode : 404;

  const msg = `Error ${statusCode} - ${context.req.url}`;

  logErrorInSentry(msg);

  return {
    props: {
      statusCode,
    },
  };
};

export default ServerError;
