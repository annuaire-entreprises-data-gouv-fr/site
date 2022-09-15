import { GetServerSidePropsContext } from 'next';
import { UAParser } from 'ua-parser-js';
import { handleErrorFromServerSideProps } from './error-handler';

export interface IPropsWithMetadata {
  metadata: {
    isBrowserOutdated: boolean;
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
  return async (context: GetServerSidePropsContext) => {
    const { props, ...redirectAndOther } = await handleErrorFromServerSideProps(
      getServerSidePropsFunction
    )(context);

    return {
      ...redirectAndOther,
      props: {
        ...props,
        metadata: {
          isBrowserOutdated: isBrowserOutdated(
            context?.req?.headers['user-agent'] || ''
          ),
        },
      },
    };
  };
}
