import React from 'react';

import Page from '../layouts';
import { ServerErrorExplanations } from '../components/error-explanations';
import MatomoEvent from '../components/matomo-event';

const ServerError: React.FC = () => {
  return (
    <Page small={true} title="Cette page est introuvable" noIndex={true}>
      <MatomoEvent category="error" action="serverError" name="" />
      <ServerErrorExplanations />
    </Page>
  );
};

export default ServerError;
