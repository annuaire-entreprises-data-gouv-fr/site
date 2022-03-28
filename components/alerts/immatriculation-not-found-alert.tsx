import React from 'react';
import Info from './info';

const ImmatriculationNotFoundAlert: React.FC = () => (
  <Info full>
    <b>Pas de justificatif d’immatriculation</b>
    <p>
      Nous n’avons{' '}
      <b>
        pas trouvé de justificatif d’immatriculation (KBIS, D1, Annonce de
        création)
      </b>{' '}
      chez nos partenaires. Il existe plusieurs explications possibles :
    </p>
    <ul>
      <li>
        Si l’entité est une{' '}
        <b>entreprise individuelle ou une auto-entreprise</b>. Dans ce cas{' '}
        <a href="#insee">l’avis d’inscription à l’Insee</a> peut être utilisé
        pour prouver l’existence de l’entreprise
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
          contactez les Chambres des Métiers de l’Artisanat
        </a>
      </li>
      <li>
        Si l’entité est une société,{' '}
        <a href="http://data.inpi.fr/">
          contactez l’INPI qui centralise les données des Greffes des tribunaux
          de commerce.
        </a>
      </li>
      <li>
        Les <b>administrations publiques</b> n’ont pas de justificatif
        d’immatriculation.
      </li>
    </ul>
  </Info>
);

export default ImmatriculationNotFoundAlert;
