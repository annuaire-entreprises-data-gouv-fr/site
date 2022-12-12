import React from 'react';
import { ErrorNotFoundExplanations } from '#components/error-explanations';
import MatomoEvent from '#components/matomo-event';
import Page from '../layouts';

const NotFound: React.FC = () => {
  return (
    <Page small={true} title="Cette page est introuvable" noIndex={true}>
      <MatomoEvent category="error" action="notFound" name="" />
      <ErrorNotFoundExplanations />
    </Page>
  );
};

export default NotFound;
