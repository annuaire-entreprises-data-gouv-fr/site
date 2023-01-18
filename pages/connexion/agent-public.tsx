import { GetServerSideProps } from 'next';
import React from 'react';
import { ReactElement } from 'react';
import ButtonMonComptePro from '#components-ui/button-mon-compte-pro';
import connexionPicture from '#components-ui/illustrations/connexion';
import ConnexionLayout from '#components/layouts/page-connexion';
import Meta from '#components/meta';
import { NextPageWithLayout } from 'pages/_app';

const Login: NextPageWithLayout = () => {
  return (
    <>
      <Meta
        title="Accédez à l’espace agent public sur Annuaire des Entreprises"
        canonical="https://annuaire-entreprises.data.gouv.fr/connexion/agent-public"
        noIndex={false}
      />
      <h1>Accédez à l’espace agent public sur Annuaire des Entreprises</h1>
      <p>
        En quelques clics, retrouvez les données, documents et justificatifs
        détenus par l’administration sur une entreprise dont vous êtes.
      </p>
      <div className="layout-center">
        <ButtonMonComptePro />
      </div>
      <br />
      <style jsx>{`
        h1,
        p {
          text-align: left;
        }
      `}</style>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <ConnexionLayout img={connexionPicture}>{page}</ConnexionLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = {} as any; //await getSession(context.req, context.res);

  const alreadyAuthenticated = session.passport && session.passport.user;
  const comeFromEntreprisePage = !!context.query.siren;

  // clean session navigation from any previous verification
  session.navigation = null;
  if (comeFromEntreprisePage) {
    // associate session with siren
    session.navigation = {
      sirenFrom: context.query.siren,
      pageFrom: context.query.page || '',
    };
  }

  if (alreadyAuthenticated) {
    if (comeFromEntreprisePage) {
      return {
        redirect: {
          destination: `/api/auth/verify`,
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: '/compte/mes-entreprises',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
};

export default Login;
