import { GetServerSideProps } from 'next';
import React from 'react';
import ButtonLink from '../../components/button';
import Page from '../../layouts';

const TooManyRequest: React.FC = () => {
  return (
    <Page small={true} title="Accès refusé">
      <h1>Nous avons reçu trop de demandes de votre part</h1>
      <p>
        Notre site a reçu trop de demande de la part de votre adresse IP en un
        temps très court, par conséquent nous ne pouvons pas répondre à votre
        requête.
      </p>
      <p>
        Si cela se reproduit, merci de nous contacter au plus vite via notre
        FAQ.
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
  context.res.statusCode = 429;
  return { props: {} };
};

export default TooManyRequest;
