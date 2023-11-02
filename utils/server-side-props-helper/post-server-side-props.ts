import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext } from 'next';
import { UAParser } from 'ua-parser-js';
import { logWarningInSentry } from '#utils/sentry';
import { closeAPM, createAPM } from '../sentry/tracing';
import { ISession, sessionOptions, setVisitTimestamp } from '../session';
import isUserAgentABot from '../user-agent';
import { handleErrorFromServerSideProps } from './error-handler';

export interface IPropsWithMetadata {
  metadata: {
    // display outdated browser banner
    isBrowserOutdated: boolean;
    isBot: boolean;
    // enable react hydration in browser
    useReact?: boolean;
    session: ISession | null;
  };
}

const isBrowserOutdated = (uaString: string) => {
  try {
    const userAgent = new UAParser(uaString);
    const browser = userAgent.getBrowser();
    // > Firefox 66, ie > 11, chrome > 72, edge ?, safari ? Safari mobile ? Chrome mobile ? Firefox mobile ?
    if (uaString && browser.name && browser.version) {
      switch (browser.name) {
        case 'Firefox':
          return parseFloat(browser.version) <= 66;
        case 'Chrome':
          return parseFloat(browser.version) <= 72;
        case 'IE':
          return parseFloat(browser.version) <= 11;
        case 'Edge':
          return parseFloat(browser.version) < 80;
        default:
          return false;
      }
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Post process a GetServerSideProps
 *
 * - enrich props with common metadata such as browser version
 * - handle error and redirects
 *
 * @param getServerSidePropsFunction
 * @returns
 */
export function postServerSideProps(
  getServerSidePropsFunction: (context: GetServerSidePropsContext) => any
) {
  return withIronSessionSsr(async (context: GetServerSidePropsContext) => {
    const url = context?.req?.url || '/unknown';

    const transaction = createAPM(url, 'postServerSideProps');

    const { props = {}, ...redirectAndOther } =
      await handleErrorFromServerSideProps(getServerSidePropsFunction)(context);

    closeAPM(transaction);

    const userAgent = context?.req?.headers['user-agent'] || '';

    await setVisitTimestamp(context.req.session);

    const browserOutdated = isBrowserOutdated(userAgent);
    if (browserOutdated) {
      logWarningInSentry('Browser outdated');
    }

    return {
      ...redirectAndOther,
      props: {
        ...props,
        metadata: {
          ...props.metadata,
          isBrowserOutdated: browserOutdated,
          isBot: isUserAgentABot(userAgent),
          session: context.req.session,
        },
      },
    };
  }, sessionOptions);
}
