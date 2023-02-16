import React from 'react';
import AvisSituationLink from '#components/avis-situation-link';
import { IUniteLegale, isAssociation } from '#models/index';
import AssociationCreationNotFoundAlert from './association-creation-not-found-alert';
import Info from './info';

const ImmatriculationNotFoundAlert: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  if (isAssociation(uniteLegale)) {
    return <AssociationCreationNotFoundAlert association={uniteLegale} />;
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
            Si cette structure est une <b>entreprise</b> (commerciale,
            artisanale, agricole, ou entreprise individuelle),{' '}
            <a href="http://data.inpi.fr/">contactez l’INPI</a>. En effet,
            l’INPI opére le Registre National des Entreprises (RNE), dans lequel
            devrait apparaitre l’entreprise.
          </li>
          <li>
            Si cette structure est un <b>service publique</b>, c’est un cas
            normal. Il n’existe pas de justificatif d’immatriculation.
          </li>
        </ul>
        En l’absence de justificatif d’immatriculation,{' '}
        <AvisSituationLink
          siret={uniteLegale.siege.siret}
          label="l’avis de situation du siège social"
        />{' '}
        permet de prouver l’existence de l’entreprise.
      </Info>
    );
  }
};

export default ImmatriculationNotFoundAlert;
