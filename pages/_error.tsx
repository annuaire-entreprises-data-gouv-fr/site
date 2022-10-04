import React from 'react';

import Page from '../layouts';
import { ServerErrorExplanations } from '../components/error-explanations';
import logErrorInSentry from '../utils/sentry';
import { IncomingMessage } from 'http';

const ServerError = () => {
  return (
    <Page small={true} title="Cette page ne fonctionne pas" noIndex={true}>
      <ServerErrorExplanations />
    </Page>
  );
};

ServerError.getInitialProps = ({
  res,
  err,
}: {
  res: IncomingMessage;
  err: any;
}) => {
  let errAsString = '';
  try {
    console.log('error 500 :', err);
    errAsString = (err || '').toString();
  } catch {
    errAsString = 'failed to serialize error';
  }

  logErrorInSentry(`Server Error (500) - unknown reason`, {
    details: errAsString,
    page: res?.url,
  });

  return { statusCode: 500 };
};

export default ServerError;
