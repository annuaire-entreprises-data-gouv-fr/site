import { GetServerSidePropsContext } from 'next';
import { getSession } from '../utils/session';

export interface IDirigeantSession {}

export function withDirigeantSession(
  getServerSidePropsFunction: (context: GetServerSidePropsContext) => any
) {
  return async (context: GetServerSidePropsContext) => {
    const comutedServerSideProps = await getServerSidePropsFunction(context);

    const session = await getSession(context.req, context.res);
    return {
      props: {
        ...comutedServerSideProps.props,
        dirigeantSession: session.passport.user || null,
      },
    };
  };
}
