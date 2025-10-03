import { ServerErrorExplanations } from "#components/error-explanations";
import Meta from "#components/meta/meta-client";
import { Exception } from "#models/exceptions";
import { logFatalErrorInSentry } from "#utils/sentry";
import type { NextPageWithLayout } from "./_app";

const ServerError: NextPageWithLayout = () => (
  <>
    <Meta noIndex={true} title="Cette page ne fonctionne pas" />
    <ServerErrorExplanations />
  </>
);

ServerError.getInitialProps = (...args) => {
  // log as JSON in order to be parse by Kibana
  try {
    console.error(JSON.stringify(args[0]));
    const { res, err } = args[0];
    logFatalErrorInSentry(
      new Exception({
        name: "ServerErrorPageDisplayed",
        cause: err,
        context: {
          page: res?.req.url,
        },
      })
    );
  } catch (e) {
    console.error("Failed to parse NextPageRequest, returning 500");
    logFatalErrorInSentry(
      new Exception({
        name: "ServerErrorPageDisplayed",
        cause: e,
        context: {},
      })
    );
  }
  return { statusCode: 500 };
};

export default ServerError;
