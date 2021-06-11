import React from 'react';
import { IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import { formatDate, formatNumbersFr } from '../../utils/helpers/formatting';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

const AssociationSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  if (!uniteLegale.association || !uniteLegale.association.id) {
    throw new Error('This component should never be rendered without a RNA ID');
  }

  const data = [
    [
      'N° RNA (identifiant d’association)',
      formatNumbersFr(uniteLegale.association.id),
    ],
  ];

  return (
    <div id="entreprise">
      <Section
        title={`Les informations au Répertoire National des Associations`}
        source={EAdministration.MI}
      >
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
    </div>
  );
};

export default AssociationSection;
