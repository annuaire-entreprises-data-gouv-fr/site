import React from 'react';
import AvisSituationLink from '#components/avis-situation-link';
import constants from '#models/constants';
import { IUniteLegale, isAssociation } from '#models/index';
import AssociationCreationNotFoundAlert from './association-creation-not-found-alert';
import Warning from './warning';

const ImmatriculationNotFoundAlert: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  if (isAssociation(uniteLegale)) {
    return <AssociationCreationNotFoundAlert association={uniteLegale} />;
  } else {
    return (
      <Warning full>
        <b>Pas de justificatif d’immatriculation</b>
        <p>
          Nous n’avons <b>pas retrouvé le justificatif d’immatriculation</b>. Il
          existe plusieurs explications possibles :
        </p>
        <ul>
          <li>
            Si cette structure est une <b>entreprise</b> (commerciale,
            artisanale, agricole, ou entreprise individuelle),{' '}
            <a href={constants.links.mailtoInpi}>contactez l’INPI</a>. En effet,
            l’INPI tient le Registre National des Entreprises (RNE), dans lequel{' '}
            <b>l’entreprise doit apparaître</b>.
          </li>
          <li>
            Si cette structure est un <b>service publique</b>, c’est un cas
            normal. Il n’existe pas de justificatif d’immatriculation.
          </li>
        </ul>
        En l’absence de justificatif d’immatriculation,{' '}
        <AvisSituationLink
          etablissement={uniteLegale.siege}
          label="l’avis de situation du siège social"
        />{' '}
        permet de prouver l’existence de l’entreprise.
      </Warning>
    );
  }
};

export default ImmatriculationNotFoundAlert;
