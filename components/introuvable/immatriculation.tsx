import React from 'react';

import ButtonLink from '../../components/button';
import { Section } from '../section';

const ImmatriculationNotFound: React.FC = () => {
  return (
    <Section title="justificatif d'immatriculation introuvable">
      <div>
        <p>
          Nous n’avons <b>pas trouvé de justificatif d’immatriculation</b> chez
          nos partenaires. Il existe plusieurs explications possibles :
        </p>
        <ul>
          <li>
            Les <b>entreprises individuelles et les auto-entreprises</b>, ne
            sont pas obligées d’être immatriculées. Il est donc possible que
            vous ne trouviez pas de fiche d’immatriculation pour une entreprise
            de ce type.
          </li>
          <li>
            Les <b>administrations publiques</b> peuvent également ne pas être
            immatriculées.
          </li>
          <li>
            Si l’entreprise est une entreprise artisanale,{' '}
            <a href="https://rnm.artisanat.fr/">
              contactez les Chambres des Métiers de l‘Artisanat
            </a>
          </li>
          <li>
            Si l’entreprise n‘est pas une entreprise artisanale,{' '}
            <a href="http://data.inpi.fr/">
              contactez l‘INPI qui centralise les données des Greffes des
              tribunaux de commerce.
            </a>
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
