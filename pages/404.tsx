import React from 'react';

import Page from '../layouts';
import { ErrorNotFoundExplanations } from '../components/error-explanations';

const NotFound: React.FC = () => {
  return (
    <Page small={true} title="Cette page est introuvable" noIndex={true}>
      <ErrorNotFoundExplanations />
    </Page>
  );
};

export default NotFound;
