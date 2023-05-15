import React from 'react';
import { ServerErrorExplanations } from '#components/error-explanations';
import MatomoEvent from '#components/matomo-event';
import Meta from '#components/meta';
import { NextPageWithLayout } from './_app';

const ServerError: NextPageWithLayout = () => {
  return (
    <>
      <Meta
        title="Cette page est introuvable"
        noIndex={true}
        canonical="https://annuaire-entreprises.data.gouv.fr/500"
      />
      <MatomoEvent category="error" action="serverError" name="" />
      <ServerErrorExplanations />
    </>
  );
};

export default ServerError;
