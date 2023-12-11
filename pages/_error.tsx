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
  // eslint-disable-next-line no-console
  console.log('ERROR', args);
  try {
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
  } catch (e) {}
  return { statusCode: 500 };
};

export default ServerError;
