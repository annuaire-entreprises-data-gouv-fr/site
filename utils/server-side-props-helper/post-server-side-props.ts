import { getIronSession } from 'iron-session';
import { GetServerSidePropsContext } from 'next';
import { IReqWithSession } from '#utils/session/with-session';
import { closeAPM, createAPM } from '../sentry/tracing';
import { ISession, sessionOptions, setVisitTimestamp } from '../session';
import { handleErrorFromServerSideProps } from './error-handler';
import parseFormBodyMiddleware from './parse-form-body';

export interface IPropsWithMetadata {
  metadata: {
    // enable react hydration in browser
    session: ISession | null;
  };
}

export type IGetServerSidePropsContextWithSession =
  GetServerSidePropsContext & {
    req: IReqWithSession;
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
  getServerSidePropsFunction: (
    context: IGetServerSidePropsContextWithSession
  ) => any
) {
  return async (context: GetServerSidePropsContext) => {
    const url = context?.req?.url || '/unknown';
    await parseFormBodyMiddleware(context);

    const transaction = createAPM(url, 'postServerSideProps');
    const contextWithSession = context as IGetServerSidePropsContextWithSession;
    contextWithSession.req.session = await getIronSession<ISession>(
      context.req,
      context.res,
      sessionOptions
    );
    const { props = {}, ...redirectAndOther } =
      await handleErrorFromServerSideProps(getServerSidePropsFunction)(
        contextWithSession
      );

    closeAPM(transaction);
    await setVisitTimestamp(contextWithSession.req.session);

    return {
      ...redirectAndOther,
      props: {
        ...props,
        metadata: {
          ...props.metadata,
          session: contextWithSession.req.session,
        },
      },
    };
  };
}
