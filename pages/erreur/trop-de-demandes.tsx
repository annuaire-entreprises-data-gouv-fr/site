import { GetServerSideProps } from 'next';
import React, { ReactElement } from 'react';
import ButtonLink from '#components-ui/button';
import { Layout } from '#components/layout';
import Meta from '#components/meta';
import { NextPageWithLayout } from 'pages/_app';

const TooManyRequest: NextPageWithLayout = () => {
  return (
    <>
      <Meta title="Accès refusé" noIndex={true} />
      <h1>Nous avons reçu trop de demandes de votre part 📈</h1>
      <p>
        Notre site a reçu trop de demandes de la part de votre adresse IP en un
        temps très court, par conséquent nous ne pouvons pas répondre à votre
        requête.
      </p>
      <ul>
        <li>
          Soit cela est du à une coincidence malheureuse et dans ce cas vous
          pouvez continuer a naviguer sur le site, cela ne devrait plus se
          produire.
        </li>
        <li>
          Soit cela est du au fait que vous partagez votre connexion avec de
          nombreuses autres personnes (le réseau internet de votre entreprise ou
          de votre administration) et dans ce cas cela peut se produire de
          nouveau.
        </li>
      </ul>
      <p>
        Si le problème se reproduit, vous pouvez nous contacter via notre FAQ.
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
  context.res.statusCode = 429;
  return { props: {} };
};

TooManyRequest.getLayout = function getLayout(
  page: ReactElement,
  isBrowserOutdated
) {
  return <Layout isBrowserOutdated={isBrowserOutdated}>{page}</Layout>;
};

export default TooManyRequest;
