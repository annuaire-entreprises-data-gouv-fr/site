import { GetServerSideProps } from 'next';
import React from 'react';
import Meta from '#components/meta';
import ButtonLink from '#components-ui/button';
import { NextPageWithLayout } from 'pages/_app';

const Forbidden: NextPageWithLayout = () => {
  return (
    <>
      <Meta title="Accès refusé" />
      <h1>Accès refusé 🚫</h1>
      <p>
        Notre algorithme de détection pense que vous êtes un robot. <br />
        Par conséquent, l’accès à cette page vous est refusé.
      </p>
      <p>
        Vous pouvez continuer a naviguer sur le site. Si vous n’êtes pas un
        robot et que le problème se reproduit, vous pouvez nous contacter via
        notre FAQ.
      </p>
      <div className="layout-left">
        <ButtonLink to="/faq" alt>
          Accéder à la FAQ
        </ButtonLink>
        <span>&nbsp;</span>
        <ButtonLink to="/">Retourner à la page d’accueil</ButtonLink>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.statusCode = 403;
  return { props: {} };
};

export default Forbidden;
