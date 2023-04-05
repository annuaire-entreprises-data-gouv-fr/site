import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import TVACell from '#components/tva-cell';
import { EAdministration } from '#models/administrations';
import { estActif } from '#models/etat-administratif';
import { IUniteLegale } from '#models/index';
import { getAdresseUniteLegale, getNomComplet } from '#models/statut-diffusion';
import { formatDate, formatIntFr, formatSiret } from '#utils/helpers';
import {
  checkHasLabelsAndCertificates,
  LabelsAndCertificatesBadgesSection,
} from '../labels-and-certificates-badges-section';

const UniteLegaleSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const hasLabelsAndCertificates = checkHasLabelsAndCertificates(uniteLegale);

  const data = [
    ['Dénomination', getNomComplet(uniteLegale)],
    ['SIREN', formatIntFr(uniteLegale.siren)],
    [
      'SIRET du siège social',
      uniteLegale.siege &&
        uniteLegale.siege.siret &&
        formatSiret((uniteLegale.siege || {}).siret),
    ],
    ['N° TVA Intracommunautaire', <TVACell />],
    [
      'Activité principale du siège social (NAF/APE)',
      uniteLegale.libelleActivitePrincipale,
    ],
    [
      <FAQLink to="/faq/modifier-adresse" tooltipLabel="Adresse postale">
        Comment modifier une adresse ?
      </FAQLink>,
      getAdresseUniteLegale(uniteLegale, true),
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
    ...(!estActif(uniteLegale)
      ? [['Date de fermeture', formatDate(uniteLegale.dateDebutActivite)]]
      : []),
    // jump line and add label and certificates
    ...(hasLabelsAndCertificates
      ? [
          ['', <br />],
          [
            'Label(s) et certificat(s)',
            <LabelsAndCertificatesBadgesSection uniteLegale={uniteLegale} />,
          ],
        ]
      : []),
  ];

  return (
    <div id="entreprise">
      <Section
        title={`Informations légales de ${getNomComplet(uniteLegale)}`}
        sources={[EAdministration.INSEE, EAdministration.VIES]}
      >
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
    </div>
  );
};

export default UniteLegaleSection;
