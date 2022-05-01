import React from 'react';

import Page from '../layouts';
import { GetServerSideProps } from 'next';
import { logErrorInSentry } from '../utils/sentry';
import { ServerErrorExplanations } from '../components/error-explanations';

const ServerError: React.FC<{ statusCode: number }> = () => (
  <Page small={true} title="Cette page ne fonctionne pas">
    <ServerErrorExplanations />
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const statusCode = context.res ? context.res.statusCode : 404;

  logErrorInSentry(`Server Error (500) - unknown reason`, {
    details: JSON.stringify(context.req),
  });

  return {
    props: {
      statusCode,
    },
  };
};

export default ServerError;
