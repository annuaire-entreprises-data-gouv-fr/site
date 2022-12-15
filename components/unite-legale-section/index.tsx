import React from 'react';
import FAQLink from '#components-ui/faq-link';
import HorizontalSeparator from '#components-ui/horizontal-separator';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import TVACell from '#components/tva-cell';
import { EAdministration } from '#models/administrations';
import { IUniteLegale } from '#models/index';
import { formatDate, formatIntFr, formatSiret } from '#utils/helpers';

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
      'Tranche effectif salarié de la structure',
      uniteLegale.libelleTrancheEffectif,
    ],
    ['Taille de la structure', uniteLegale.libelleCategorieEntreprise],
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
    </div>
  );
};

export default UniteLegaleSection;
