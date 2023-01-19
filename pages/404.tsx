import React from 'react';
import { ErrorNotFoundExplanations } from '#components/error-explanations';
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

export default NotFound;
