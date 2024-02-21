import { ServerErrorExplanations } from '#components/error-explanations';
import Meta from '#components/meta';
import { Exception } from '#models/exceptions';
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

ServerError.getInitialProps = (...args) => {
  // log as JSON in order to be parse by Kibana
  try {
    console.error(args[0]);
    const { res, err } = args[0];
    logFatalErrorInSentry(
      new Exception({
        name: 'ServerErrorPageDisplayed',
        cause: err,
        context: {
          page: res?.req.url,
        },
      })
    );
  } catch (e) {
    console.error('Failed to parse NextPageRequest, returning 500');
    logFatalErrorInSentry(
      new Exception({
        name: 'ServerErrorPageDisplayed',
        cause: e,
        context: {},
      })
    );
  }
  return { statusCode: 500 };
};

export default ServerError;
