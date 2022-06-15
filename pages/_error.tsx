import React from 'react';

import Page from '../layouts';
import { NextPage } from 'next';
import { logErrorInSentry } from '../utils/sentry';
import { ServerErrorExplanations } from '../components/error-explanations';
import NextErrorComponent from 'next/error';

const ServerError: NextPage<{}> = () => (
  <Page small={true} title="Cette page ne fonctionne pas">
    <ServerErrorExplanations />
  </Page>
);

ServerError.getInitialProps = async ({ res, err, asPath }) => {
  try {
    //@ts-ignore
    const errorInitialProps = await NextErrorComponent.getInitialProps({
      res,
      err,
    });

    if (!err) {
      throw new Error('error is missing');
    }
    logErrorInSentry(err);
    return errorInitialProps;
  } catch {
    logErrorInSentry(
      `_error.js getInitialProps missing data at path: ${asPath}`
    );
  }

  return { props: {} };
};

export default ServerError;
