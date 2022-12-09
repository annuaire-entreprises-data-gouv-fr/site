import React from 'react';
import AvisSituationLink from '../../components/avis-situation-link';
import { isServicePublic, IUniteLegale } from '../../models';
import { isAssociation } from '../../models';
import AssociationCreationNotFoundAlert from './association-creation-not-found-alert';
import Info from './info';

const ImmatriculationNotFoundAlert: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  if (isAssociation(uniteLegale)) {
    return <AssociationCreationNotFoundAlert uniteLegale={uniteLegale} />;
  } else if (uniteLegale.complements.estEntrepreneurIndividuel) {
    return (
      <Info full>
        <b>Pas de justificatif d’immatriculation au RNM ou au RNCS</b>
        <p>
          Comme cette structure est une{' '}
          <b>entreprise individuelle ou une auto-entreprise</b>, elle n’est pas
          nécessairement immatriculée au RNM ou RNCS.
          <br />
          Dans ce cas,{' '}
          <AvisSituationLink
            siret={uniteLegale.siege.siret}
            label="l’avis de situation du siège social"
          />{' '}
          sert à prouver l’existence de l’entreprise.
        </p>
      </Info>
    );
  }
  if (isServicePublic(uniteLegale)) {
    return null;
  } else {
    return (
      <Info full>
        <b>Pas de justificatif d’immatriculation</b>
        <p>
          Nous n’avons <b>pas trouvé de justificatif d’immatriculation</b> chez
          nos partenaires. Il existe plusieurs explications possibles :
        </p>
        <ul>
          <li>
            Si cette structure est une entreprise artisanale,{' '}
            <a href="https://rnm.artisanat.fr/">
              contactez les Chambres des Métiers de l’Artisanat
            </a>
          </li>
          <li>
            Si cette structure est une entreprise commerciale,{' '}
            <a href="http://data.inpi.fr/">
              contactez l’INPI qui centralise les données des Greffes des
              tribunaux de commerce.
            </a>
          </li>
          <li>
            Si cette structure est un <b>service publique</b>, c’est un cas
            normal. Il n’existe pas de justificatif d’immatriculation.
          </li>
        </ul>
      </Info>
    );
  }
};

export default ImmatriculationNotFoundAlert;
