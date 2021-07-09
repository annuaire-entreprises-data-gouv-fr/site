import React from 'react';
import { IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import {
  capitalize,
  formatDate,
  formatNumbersFr,
} from '../../utils/helpers/formatting';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

const UniteLegaleSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const data = [
    ['Dénomination', capitalize(uniteLegale.nomComplet)],
    ['SIREN', formatNumbersFr(uniteLegale.siren)],
    [
      'SIRET du siège social',
      uniteLegale.siege &&
        uniteLegale.siege.siret &&
        formatSiret((uniteLegale.siege || {}).siret),
    ],
    ['N° TVA Intracommunautaire', formatNumbersFr(uniteLegale.numeroTva)],
    [
      'Activité principale du siège social (NAF/APE)',
      uniteLegale.libelleActivitePrincipale,
    ],
    ['Nature juridique', uniteLegale.libelleNatureJuridique],
    [
      'Tranche effectif salarié de l’entité',
      uniteLegale.libelleTrancheEffectif,
    ],
    ['Date de création', formatDate(uniteLegale.dateCreation)],
    [
      'Date de dernière mise à jour',
      formatDate(uniteLegale.dateDerniereMiseAJour),
    ],
  ];

  if (uniteLegale.estActive === false) {
    data.push(['Date de fermeture', formatDate(uniteLegale.dateDebutActivite)]);
  }
  if (uniteLegale.estEss) {
    data.push(['Economie Sociale et Solidaire', 'Oui']);
  }

  return (
    <div id="entreprise">
      <Section
        title={`Les informations sur cette entité`}
        source={EAdministration.INSEE}
      >
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
    </div>
  );
};

export default UniteLegaleSection;
