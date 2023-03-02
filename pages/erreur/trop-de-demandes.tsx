import { GetServerSideProps } from 'next';
import React from 'react';
import ButtonLink from '#components-ui/button';
import Meta from '#components/meta';
import constants from '#models/constants';
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
          Si vous travaillez <b>pour un service public</b> (administration,
          ministère, collectivité),{' '}
          <a href={`mailto:${constants.links.mailto}`}>contactez-nous</a> et
          nous ferons le nécessaire pour que cela ne se reproduise pas.
        </li>
        <li>
          Si <b>vous utilisez des robots 🤖</b> pour scrapper les données du
          site. <b>Sachez que toutes les données sont publiques !</b> Alors{' '}
          <a href="/sources-de-donnees">utilisez les API</a>. Cela sera plus
          stable et efficace pour tout le monde.
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

export default TooManyRequest;
