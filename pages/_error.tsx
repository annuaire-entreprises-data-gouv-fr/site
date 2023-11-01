import { ServerErrorExplanations } from '#components/error-explanations';
import Meta from '#components/meta';
import { logFatalErrorInSentry } from '#utils/sentry';
import { NextPageWithLayout } from './_app';

const ServerError: NextPageWithLayout = () => {
  return (
    <>
      <Meta title="Cette page ne fonctionne pas" noIndex={true} />
      <ServerErrorExplanations />
    </>
  );
};

ServerError.getInitialProps = ({ res, err }) => {
  logFatalErrorInSentry(err, {
    page: res?.req.url,
  });
  return { statusCode: 500 };
};

export default ServerError;
