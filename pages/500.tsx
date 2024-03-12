import { ServerErrorExplanations } from '#components/error-explanations';
import MatomoEvent from '#components/matomo-event';
import Meta from '#components/meta/meta-client';
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

export default ServerError;
