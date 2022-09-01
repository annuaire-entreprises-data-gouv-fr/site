import React from 'react';
import { IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import { formatDate, formatIntFr } from '../../utils/helpers/formatting';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import BreakPageForPrint from '../../components-ui/print-break-page';
import HorizontalSeparator from '../../components-ui/horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import TvaSection from '../tva-section';

const UniteLegaleSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const data = [
    ['Dénomination', uniteLegale.nomComplet],
    ['SIREN', formatIntFr(uniteLegale.siren)],
    [
      'SIRET du siège social',
      uniteLegale.siege &&
        uniteLegale.siege.siret &&
        formatSiret((uniteLegale.siege || {}).siret),
    ],
    [
      'Activité principale du siège social (NAF/APE)',
      uniteLegale.libelleActivitePrincipale,
    ],
    ['Adresse du siège social', uniteLegale.siege.adresse],
    ['Nature juridique', uniteLegale.libelleNatureJuridique],
    [
      'Tranche effectif salarié de l’entité',
      uniteLegale.libelleTrancheEffectif,
    ],
    ['Catégorie d’entreprise', uniteLegale.libelleCategorieEntreprise],
    ['Economie Sociale et Solidaire (ESS)', uniteLegale.estEss ? 'Oui' : 'Non'],
    ['Date de création', formatDate(uniteLegale.dateCreation)],
    [
      'Date de dernière mise à jour',
      formatDate(uniteLegale.dateDerniereMiseAJour),
    ],
  ];

  if (uniteLegale.estActive === false) {
    data.push(['Date de fermeture', formatDate(uniteLegale.dateDebutActivite)]);
  }

  return (
    <div id="entreprise">
      <Section
        title={`Les informations sur cette entité`}
        source={EAdministration.INSEE}
      >
        <TwoColumnTable body={data} />
      </Section>
      <TvaSection uniteLegale={uniteLegale} />
      <HorizontalSeparator />
      <BreakPageForPrint />
    </div>
  );
};

export default UniteLegaleSection;
