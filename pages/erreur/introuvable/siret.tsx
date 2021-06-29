import React from 'react';

import Page from '../../../layouts';
import ButtonLink from '../../../components/button';

const SiretNotFoundPage: React.FC<{}> = () => {
  return (
    <Page small={true} title="Numero Siret introuvable" noIndex={true}>
      <div className="content-container">
        <h1>Ce numéro SIRET est introuvable</h1>
        <div>
          <p>Il existe plusieurs explications possibles :</p>
          <ul>
            <li>
              Vous avez peut-être commis une erreur en tapant votre numéro SIRET
              et celui-ci n'existe pas
            </li>
            <li>
              Ce SIRET fait peut-être référence à une entreprise{' '}
              <a href="/faq">non-diffusible</a>.
            </li>
            <li>
              Ce SIRET fait peut-être référence à une entité publique dont les
              informations sont protégées (Ministère de Défense, Gendarmerie,
              parlementaire etc.)
            </li>
            <li>
              Ce SIRET fait référence à une entreprise crée récemment et{' '}
              <a href="/faq">nos informations ne sont pas encore à jour</a>.
            </li>
          </ul>
          <p>Consultez notre FAQ pour en savoir plus.</p>
        </div>
        <div className="layout-center">
          <ButtonLink href="/faq">Consultez la FAQ</ButtonLink>
        </div>
      </div>
    </Page>
  );
};

export default SiretNotFoundPage;
