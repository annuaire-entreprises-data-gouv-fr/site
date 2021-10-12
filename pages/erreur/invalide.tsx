import React from 'react';
import { GetServerSideProps } from 'next';

import Page from '../../layouts';
import ButtonLink from '../../components/button';
import constants from '../../constants';

const SirenOrSiretInvalidPage = () => {
  return (
    <Page small={true} title="Numero d’identification invalide" noIndex={true}>
      <div className="content-container text-wrapper">
        <h1>⚠️ Attention : ce numéro d’identification est invalide</h1>
        <div>
          <p>
            Si vous voyez cette page, c’est que le numéro que vous recherchez
            ressemble à un numéro siren/siret par sa forme (9 chiffres pour le
            siren ou 14 chiffres pour le siret) mais qu’il ne respecte pas{' '}
            <a
              href="https://fr.wikipedia.org/wiki/Formule_de_Luhn"
              target="_blank"
              rel="noreferrer noopener"
            >
              l’algorithme de vérification.
            </a>
          </p>
          <p>
            Nous vous invitons à la plus grande vigilance, car il peut s’agir
            d’un numéro frauduleux :
          </p>
          <ul>
            <li>
              Vérifiez que vous n’avez pas commis de faute de frappe en
              recopiant le numero.
            </li>
            <li>
              Vérifiez ce numero auprès de l’organisme ou l’entreprise qui vous
              l’a transmis.
            </li>
          </ul>
          <p>
            Si vous avez effectué ces deux vérifications et que cette page
            s’affiche toujours, n’hésitez pas à{' '}
            <a href={constants.links.mailto}>nous contacter.</a>
          </p>
        </div>
        <div className="layout-center">
          <ButtonLink to="/">Retourner à l’écran d’accueil</ButtonLink>
        </div>
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.statusCode = 400;
  return { props: {} };
};

export default SirenOrSiretInvalidPage;
