import { GetServerSidePropsContext } from 'next';
import { verifySiren } from '../utils/helpers/siren-and-siret';
import { getSession } from '../utils/session';
import { isCompanyOwner } from '../utils/session/accessSession';

export function withOnlyDirigeant(
  getServerSidePropsFunction: (context: GetServerSidePropsContext) => any
) {
  return async (context: GetServerSidePropsContext) => {
    const serverSideProps = await getServerSidePropsFunction(context);
    const session = (await getSession(context.req, context.res)) as any;

    const slug = context?.params?.slug as string;
    const siren = verifySiren(slug || '');
    const isOwner = isCompanyOwner(session, siren);

    console.log(serverSideProps);

    if (isOwner) {
      return serverSideProps;
    }
    return {
      redirect: {
        destination: `/connexion/dirigeant?siren=${siren}`,
        permanent: false,
      },
    };
  };
}
