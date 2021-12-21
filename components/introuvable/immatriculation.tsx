import React from 'react';

import ButtonLink from '../../components/button';
import { Section } from '../section';

const ImmatriculationNotFound: React.FC = () => {
  return (
    <Section title="Pas de justificatif d'immatriculation">
      <div>
        <p>
          Nous n’avons <b>pas trouvé de justificatif d’immatriculation</b> chez
          nos partenaires. Il existe plusieurs explications possibles :
        </p>
        <ul>
          <li>
            Si l’entité est une{' '}
            <b>entreprise individuelle ou une auto-entreprise</b>, elle n’est
            pas nécessairement immatriculée au RNM ou RNCS. Dans ce cas{' '}
            <a href="#insee">l’avis d’inscription à l’Insee</a> sert à prouver
            l’existence de l’entreprise
          </li>
          <li>
            Si l’entité est une association,{' '}
            <a href="https://www.journal-officiel.gouv.fr/associations/">
              contactez le Journal Officiel des Associations
            </a>
          </li>
          <li>
            Si l’entité est une entreprise artisanale,{' '}
            <a href="https://rnm.artisanat.fr/">
              contactez les Chambres des Métiers de l‘Artisanat
            </a>
          </li>
          <li>
            Si l’entité est une entreprise commerciale,{' '}
            <a href="http://data.inpi.fr/">
              contactez l‘INPI qui centralise les données des Greffes des
              tribunaux de commerce.
            </a>
          </li>
          <li>
            Les <b>administrations publiques</b> n’ont pas de justificatif
            d’immatriculation.
          </li>
        </ul>
        <p>Consultez notre FAQ pour en savoir plus.</p>
      </div>
      <div className="layout-center">
        <ButtonLink to="/faq">Consultez la FAQ</ButtonLink>
      </div>
    </Section>
  );
};

export default ImmatriculationNotFound;
