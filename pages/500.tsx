import React from 'react';

import Page from '../layouts';
import { ServerErrorExplanations } from '../components/error-explanations';

const ServerError: React.FC = () => {
  return (
    <Page small={true} title="Cette page est introuvable" noIndex={true}>
      <ServerErrorExplanations />
    </Page>
  );
};

export default ServerError;
