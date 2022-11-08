import React from 'react';

import Page from '../layouts';
import { ErrorNotFoundExplanations } from '../components/error-explanations';
import MatomoEvent from '../components/matomo-event';

const NotFound: React.FC = () => {
  return (
    <Page small={true} title="Cette page est introuvable" noIndex={true}>
      <MatomoEvent category="error" action="notFound" name="" />
      <ErrorNotFoundExplanations />
    </Page>
  );
};

export default NotFound;
