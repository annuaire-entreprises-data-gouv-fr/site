import React from 'react';
import { IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import { formatNumbersFr } from '../../utils/helpers/formatting';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

const AssociationSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const { association } = uniteLegale;

  if (!association || !association.id) {
    throw new Error('This component should never be rendered without a RNA ID');
  }

  const data = [
    ['N° RNA (identifiant d’association)', formatNumbersFr(association.id)],
    ['Nom', association.nomComplet],
    ['Objet', association.objet],
    ['Adresse', association.adresse],
  ];

  return (
    <div id="entreprise">
      <Section
        title={`Les informations au Répertoire National des Associations`}
        source={EAdministration.MI}
      >
        <p>
          Cette entité est inscrite au{' '}
          <b>Répertoire National des Associations (RNA)</b>, qui contient les
          informations suivantes&nbsp;:
        </p>
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
    </div>
  );
};

export default AssociationSection;
