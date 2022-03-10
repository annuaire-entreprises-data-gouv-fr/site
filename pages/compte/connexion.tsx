import { GetServerSideProps } from 'next';
import React from 'react';
import { INSEE } from '../../components/administrations';
import ButtonFranceConnect from '../../components/button-france-connect';
import connexionPicture from '../../components/illustrations/connexion';

import PageConnexion from '../../layouts/page-connexion';
import { getSession } from '../../utils/session';

const Login: React.FC = () => {
  return (
    <PageConnexion
      title="Accédez à vos données d’entreprise"
      noIndex={true}
      session={null}
      img={connexionPicture}
    >
      <h1>Accédez à vos données d’entreprise</h1>
      <p>
        En quelques clics, retrouvez toutes les données, tous les documents et
        tous les justificatifs détenus par l’administration.
      </p>
      <p>
        <h3>Comment ça marche ?</h3>
        FranceConnect nous fourni votre état civil, et l’
        <INSEE /> nous confirme que vous êtes bien dirigeant(e) de l’entreprise
        :
      </p>
      <br />
      <div className="france-connect-container">
        <ButtonFranceConnect />
        <div>
          <a href="https://franceconnect.gouv.fr/">
            Qu’est-ce que FranceConnect ?
          </a>
        </div>
      </div>
      <br />
      <style jsx>{`
        h1,
        p {
          text-align: left;
        }
        .france-connect-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .france-connect-container a {
          font-size: 0.8rem;
        }
      `}</style>
    </PageConnexion>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context.req, context.res);

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
          destination: `/api/account/verify`,
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
