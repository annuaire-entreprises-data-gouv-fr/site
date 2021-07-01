import React from 'react';

import Page from '../../../layouts';
import ButtonLink from '../../../components/button';
import constants from '../../../constants';

const SiretInvalidPage: React.FC = () => {
  return (
    <Page small={true} title="Numero siret introuvable" noIndex={true}>
      <div className="content-container text-wrapper">
        <h1>⚠️ Attention : ce numéro siret est invalide</h1>
        <div>
          <p>
            Si vous voyez cette page, c'est que le numéro siret que vous
            recherchez ressemble à un numéro siret par sa forme (14 chiffres)
            mais qu'il ne respecte pas{' '}
            <a
              href="https://fr.wikipedia.org/wiki/Formule_de_Luhn"
              target="_blank"
              rel="noreferrer noopener"
            >
              l'algorithme de vérification.
            </a>
          </p>
          <p>
            Nous vous invitons à la plus grande vigilance, car il peut s'agir
            d'un numéro frauduleux :
          </p>
          <ul>
            <li>
              Vous pouvez vérifier que vous n'avez pas commis de faute de frappe
              en recopiant le siret.
            </li>
            <li>
              Vous pouvez vérifier ce siret auprès de l'organisme qui vous l'a
              transmis.
            </li>
          </ul>
          <p>
            Si vous avez effectué ces deux vérifications et que cette page
            s'affiche toujours, n'hésitez pas à{' '}
            <a href={constants.links.mailto}>nous contacter.</a>
          </p>
        </div>
        <div className="layout-center">
          <ButtonLink href="/">Retourner à l’écran d'accueil</ButtonLink>
        </div>
      </div>
    </Page>
  );
};

export default SiretInvalidPage;
