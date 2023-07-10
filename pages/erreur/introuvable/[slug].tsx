import { GetServerSideProps } from 'next';
import React from 'react';
import ButtonLink from '#components-ui/button';
import MatomoEvent from '#components/matomo-event';
import Meta from '#components/meta';
import { NextPageWithLayout } from 'pages/_app';

type SirenOrSiretNotFoundPageProps = {
  slug?: string;
};

const SirenOrSiretNotFoundPage: NextPageWithLayout<
  SirenOrSiretNotFoundPageProps
> = ({ slug = '' }) => {
  return (
    <>
      <Meta title="Numéro d’identification introuvable" noIndex={true} />
      <MatomoEvent category="error" action="sirenOrSiretNotFound" name="" />
      <h1>Le numéro d’identification “{slug}” n’existe pas</h1>
      <div>
        <p>Il existe plusieurs explications possibles :</p>
        <ul>
          <li>
            Vous avez peut-être commis une erreur en tapant votre numéro
            SIREN/SIRET et celui-ci n’existe pas
          </li>
          <li>
            Ce numéro fait peut-être référence à une entreprise{' '}
            <a href="/faq">non-diffusible</a>.
          </li>
          <li>
            Ce numéro fait peut-être référence à une structure publique dont les
            informations sont protégées (Ministère de Défense, Gendarmerie,
            parlementaire etc.)
          </li>
          <li>
            Ce numéro fait référence à une entreprise crée récemment et{' '}
            <a href="/faq">nos informations ne sont pas encore à jour</a>.
          </li>
        </ul>
        <p>Consultez notre FAQ pour en savoir plus.</p>
      </div>
      <div className="layout-center">
        <ButtonLink to="/faq">Consultez la FAQ</ButtonLink>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.statusCode = 404;
  const slug = (context?.params?.slug || '') as string;

  return { props: { slug } };
};

export default SirenOrSiretNotFoundPage;
