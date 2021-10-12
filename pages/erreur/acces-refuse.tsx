import { GetServerSideProps } from 'next';
import React from 'react';
import ButtonLink from '../../components/button';
import Page from '../../layouts';

const Forbidden: React.FC = () => {
  return (
    <Page small={true} title="Accès refusé">
      <h1>Accès refusé 🤖</h1>
      <p>
        Notre algorithme de détection pense que vous êtes un robot. <br />
        Par conséquent, l’accès à cette page vous est refusé.
      </p>
      <p>
        Si c’est une erreur, merci de nous contacter au plus vite via notre FAQ.
      </p>
      <div className="layout-left">
        <ButtonLink to="/faq" alt>
          Accéder à la FAQ
        </ButtonLink>
        <span>&nbsp;</span>
        <ButtonLink to="/">Retourner à la page d’accueil</ButtonLink>
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.statusCode = 403;
  return { props: {} };
};

export default Forbidden;
