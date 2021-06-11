import React from 'react';

import Page from '../layouts';
import { ErrorNotFoundExplanations } from '../components/error-explanations';

const ServerError: React.FC = () => {
  return (
    <Page small={true} title="Cette page est introuvable">
      <ErrorNotFoundExplanations />
    </Page>
  );
};

export default ServerError;
