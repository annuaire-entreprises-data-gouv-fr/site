import { getIronSession } from 'iron-session';
import { GetServerSidePropsContext } from 'next';
import { IReqWithSession } from '#utils/session/with-session';
import { closeAPM, createAPM } from '../../sentry/tracing';
import { ISession, sessionOptions, setVisitTimestamp } from '../../session';
import { errorRedirection } from '../redirection';
import { getContext } from './error-context';

export interface IPropsWithMetadata {
  metadata: {
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

/**
 * Handle exceptions raised in getServersSideProps
 *
 * @param getServerSidePropsFunction
 * @returns
 */
export function handleErrorFromServerSideProps<
  C extends GetServerSidePropsContext
>(getServerSidePropsFunction: (context: C) => any) {
  return async (context: C) => {
    try {
      return await getServerSidePropsFunction(context);
    } catch (exception: any) {
      const message = exception.message;
      const ctx = getContext(context.req, message);
      const { destination } = errorRedirection(exception, ctx);

      return {
        redirect: {
          destination,
          permanent: false,
        },
      };
    }
  };
}
