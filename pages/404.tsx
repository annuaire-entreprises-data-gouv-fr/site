import React, { ReactElement } from 'react';
import { ErrorNotFoundExplanations } from '#components/error-explanations';
import { Layout } from '#components/layout';
import MatomoEvent from '#components/matomo-event';
import Meta from '#components/meta';
import { NextPageWithLayout } from './_app';

const NotFound: NextPageWithLayout = () => {
  return (
    <>
      <Meta title="Cette page est introuvable" noIndex />
      <MatomoEvent category="error" action="notFound" name="" />
      <ErrorNotFoundExplanations />
    </>
  );
};

NotFound.getLayout = function getLayout(page: ReactElement, isBrowserOutdated) {
  return <Layout isBrowserOutdated={isBrowserOutdated}>{page}</Layout>;
};

export default NotFound;
