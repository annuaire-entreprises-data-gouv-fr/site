import { GetServerSidePropsContext } from 'next';
import { getSession } from '../utils/session';
import { ISession } from '../utils/session/manageSession';

export interface IPropsWithSession {
  session: ISession | null;
}

export function withSession(
  getServerSidePropsFunction: (context: GetServerSidePropsContext) => any
) {
  return async (context: GetServerSidePropsContext) => {
    const comutedServerSideProps = await getServerSidePropsFunction(context);
    const session = (await getSession(context.req, context.res)) as any;

    return {
      props: {
        ...comutedServerSideProps.props,
        session: session || null,
      },
    };
  };
}
