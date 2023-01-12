import React, { ReactElement } from 'react';
import { ServerErrorExplanations } from '#components/error-explanations';
import { Layout } from '#components/layout';
import logErrorInSentry from '#utils/sentry';
import Page from '../layouts';
import { NextPageWithLayout } from './_app';

const ServerError: NextPageWithLayout = () => {
  return (
    <Page small={true} title="Cette page ne fonctionne pas" noIndex={true}>
      <ServerErrorExplanations />
    </Page>
  );
};

ServerError.getInitialProps = ({ res, err }) => {
  let errAsString = '';
  try {
    console.error('error 500 :', err);
    errAsString = (err || '').toString();
  } catch {
    errAsString = 'failed to serialize error';
  }

  logErrorInSentry(`Server Error (500) - unknown reason`, {
    details: errAsString,
    page: res?.req.url,
  });

  return { statusCode: 500 };
};

ServerError.getLayout = function getLayout(
  page: ReactElement,
  isBrowserOutdated
) {
  return <Layout isBrowserOutdated={isBrowserOutdated}>{page}</Layout>;
};

export default ServerError;
