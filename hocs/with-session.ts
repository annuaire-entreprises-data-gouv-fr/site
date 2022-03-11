import { GetServerSidePropsContext } from 'next';
import { getSession } from '../utils/session';
import { ISession, isLoggedIn } from '../utils/session/accessSession';

export interface IPropsWithSession {
  session: ISession | null;
}

export function withSession(
  getServerSidePropsFunction: (context: GetServerSidePropsContext) => any
) {
  return async (context: GetServerSidePropsContext) => {
    const { props, redirect } = await getServerSidePropsFunction(context);
    const currentSession = (await getSession(context.req, context.res)) as any;

    if (redirect) {
      // if props contains a redirect, simply return it.
      return { redirect };
    }

    return {
      props: {
        ...props,
        session: isLoggedIn(currentSession) ? currentSession : null,
      },
    };
  };
}
