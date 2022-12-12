import React from 'react';
import { IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administrations';
import { formatDate, formatIntFr } from '../../utils/helpers/formatting';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
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
      'Tranche effectif salarié de la structure',
      uniteLegale.libelleTrancheEffectif,
    ],
    ['Taille de la structure', uniteLegale.libelleCategorieEntreprise],
    ['Date de création', formatDate(uniteLegale.dateCreation)],
    [
      'Dernière modification des données Insee',
      formatDate(uniteLegale.dateDerniereMiseAJour),
    ],
    uniteLegale.estActive === false
      ? ['Date de fermeture', formatDate(uniteLegale.dateDebutActivite)]
      : null,
    ['', <br />],
    uniteLegale.complements.estEss || uniteLegale.complements.estRGE
      ? [
          'Label(s) & certification(s)',
          <>
            {uniteLegale.complements.estEss && (
              <div>ESS - Entreprise Sociale et Solidaire</div>
            )}
            {uniteLegale.complements.estEss && (
              <div>RGE - Reconnu Garant de l’Environnement</div>
            )}
          </>,
        ]
      : null,
  ];

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
