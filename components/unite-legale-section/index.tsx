import React from 'react';
import { IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administrations';
import { formatDate, formatIntFr } from '../../utils/helpers/formatting';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import BreakPageForPrint from '../../components-ui/print-break-page';
import HorizontalSeparator from '../../components-ui/horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import TVACell from '../tva-cell';
import FAQLink from '../../components-ui/faq-link';

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
      <FAQLink tooltipLabel="N° TVA Intracommunautaire">
        <a href="/faq/tva-intracommunautaire">
          Qu’est ce que le numéro de TVA intracommunautaire ?
        </a>
      </FAQLink>,
      <TVACell />,
    ],
    [
      'Activité principale du siège social (NAF/APE)',
      uniteLegale.libelleActivitePrincipale,
    ],
    [
      <FAQLink tooltipLabel="Adresse postale">
        <a href="/faq/modifier-adresse">Comment modifier une adresse ?</a>
      </FAQLink>,
      uniteLegale.siege.adresse
        ? `${
            uniteLegale.siege.denomination
              ? `${uniteLegale.siege.denomination}, `
              : ''
          }${uniteLegale.siege.adresse}`
        : '',
    ],
    ['Nature juridique', uniteLegale.libelleNatureJuridique],
    [
      'Tranche effectif salarié de l’entité',
      uniteLegale.libelleTrancheEffectif,
    ],
    ['Taille d’entreprise', uniteLegale.libelleCategorieEntreprise],
    ['Date de création', formatDate(uniteLegale.dateCreation)],
    [
      'Date de dernière mise à jour',
      formatDate(uniteLegale.dateDerniereMiseAJour),
    ],
  ];

  if (uniteLegale.estActive === false) {
    data.push(['Date de fermeture', formatDate(uniteLegale.dateDebutActivite)]);
  }

  if (uniteLegale.complements.estEss) {
    data.push(['Economie Sociale et Solidaire (ESS)', 'Oui']);
  }

  return (
    <div id="entreprise">
      <Section
        title={`Résumé`}
        sources={[EAdministration.INSEE, EAdministration.VIES]}
      >
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
      <BreakPageForPrint />
    </div>
  );
};

export default UniteLegaleSection;
