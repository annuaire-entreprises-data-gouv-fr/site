import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext } from 'next';
import { closeAPM, createAPM } from '../sentry/tracing';
import { ISession, sessionOptions, setVisitTimestamp } from '../session';
import isUserAgentABot from '../user-agent';
import { handleErrorFromServerSideProps } from './error-handler';

export interface IPropsWithMetadata {
  metadata: {
    // display outdated browser banner
    isBot: boolean;
    // enable react hydration in browser
    useReact?: boolean;
    session: ISession | null;
  };
}

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

    return {
      ...redirectAndOther,
      props: {
        ...props,
        metadata: {
          ...props.metadata,
          isBot: isUserAgentABot(userAgent),
          session: context.req.session,
        },
      },
    };
  }, sessionOptions);
}
