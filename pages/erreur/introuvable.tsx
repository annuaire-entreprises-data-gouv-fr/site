import React from 'react';
import { GetServerSideProps } from 'next';

import Page from '../../layouts';
import ButtonLink from '../../components/button';

const SirenOrSiretNotFoundPage = () => {
  return (
    <Page title="Numero d’identification introuvable" noIndex={true}>
      <h1>Ce numéro d’identification (siren/siret) est introuvable 🔎</h1>
      <div>
        <p>Il existe plusieurs explications possibles :</p>
        <ul>
          <li>
            Vous avez peut-être commis une erreur en tapant votre numéro
            siren/siret et celui-ci n’existe pas
          </li>
          <li>
            Ce numéro fait peut-être référence à une entreprise{' '}
            <a href="/faq">non-diffusible</a>.
          </li>
          <li>
            Ce numéro fait peut-être référence à une entité publique dont les
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
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.statusCode = 404;
  return { props: {} };
};

export default SirenOrSiretNotFoundPage;
