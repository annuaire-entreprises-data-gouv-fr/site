import React from 'react';
import FAQLink from '#components-ui/faq-link';
import HorizontalSeparator from '#components-ui/horizontal-separator';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import TVACell from '#components/tva-cell';
import {
  checkHasLabelsAndCertificates,
  LabelsAndCertificates,
} from '#components/unite-legale-section/labels-and-certificates';
import { EAdministration } from '#models/administrations';
import { IUniteLegale } from '#models/index';
import { formatDate, formatIntFr, formatSiret } from '#utils/helpers';

const UniteLegaleSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const hasLabelsAndCertificates = checkHasLabelsAndCertificates(uniteLegale);

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
    ...(uniteLegale.estActive === false
      ? [['Date de fermeture', formatDate(uniteLegale.dateDebutActivite)]]
      : []),
    // jump line and add label and certificates
    ...(hasLabelsAndCertificates
      ? [
          ['', <br />],
          [
            'Label ou certification',
            <LabelsAndCertificates uniteLegale={uniteLegale} />,
          ],
        ]
      : []),
  ];

  return (
    <div id="entreprise">
      <Section
        title={`Résumé`}
        sources={[
          EAdministration.INSEE,
          EAdministration.VIES,
          EAdministration.DINUM,
        ]}
      >
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
    </div>
  );
};

export default UniteLegaleSection;
