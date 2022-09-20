import React from 'react';

import Page from '../layouts';
import { logErrorInSentry } from '../utils/sentry';
import { ServerErrorExplanations } from '../components/error-explanations';
import { GetServerSideProps } from 'next';

const ServerError: React.FC<{ statusCode: number }> = () => (
  <Page small={true} title="Cette page ne fonctionne pas" noIndex={true}>
    <ServerErrorExplanations />
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const statusCode = context?.res?.statusCode || 404;
  const page = context?.req?.url;

  logErrorInSentry(`Server Error (500) - unknown reason`, { page });

  return {
    props: {
      statusCode,
    },
  };
};

export default ServerError;
