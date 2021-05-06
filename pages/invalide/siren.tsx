import React from 'react';

import Page from '../../layouts';
import ButtonLink from '../../components/button';
import constants from '../../constants';

const SirenInvalidPage: React.FC = () => {
  return (
    <Page small={true} title="Numero Siren introuvable">
      <div className="content-container">
        <h1>⚠️ Attention : ce numéro siren est invalide</h1>
        <div>
          <p>
            Si vous voyez cette page, c'est que le numéro siren que vous
            recherchez ressemble à un numéro siren par sa forme (9 chiffres)
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
              Vérifiez que vous n'avez pas commis de faute de frappe en
              recopiant le siren.
            </li>
            <li>
              Vérifiez ce siren auprès de l'organisme ou l'entreprise qui vous
              l'a transmis.
            </li>
          </ul>
          <br />
          <p>
            Si vous avez effectué ces deux vérifications et que cette page
            s'affiche toujours, n'hésitez pas à{' '}
            <a href={constants.links.mailto}>nous contacter.</a>
          </p>
          <br />
        </div>
        <div className="layout-center">
          <ButtonLink href="/">Retourner à l’écran d'accueil</ButtonLink>
        </div>
      </div>
    </Page>
  );
};

export default SirenInvalidPage;
