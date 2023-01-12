import React, { ReactElement } from 'react';
import { ServerErrorExplanations } from '#components/error-explanations';
import { Layout } from '#components/layout';
import MatomoEvent from '#components/matomo-event';
import Meta from '#components/meta';
import { NextPageWithLayout } from './_app';

const ServerError: NextPageWithLayout = () => {
  return (
    <>
      <Meta title="Cette page est introuvable" noIndex={true} />
      <MatomoEvent category="error" action="serverError" name="" />
      <ServerErrorExplanations />
    </>
  );
};

ServerError.getLayout = function getLayout(
  page: ReactElement,
  isBrowserOutdated
) {
  return <Layout isBrowserOutdated={isBrowserOutdated}>{page}</Layout>;
};

export default ServerError;
