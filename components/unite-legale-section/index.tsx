import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { ConventionCollectivesBadgesSection } from '#components/badges-section/convention-collectives';
import AvisSituationLink from '#components/justificatifs/avis-situation-link';
import ExtraitRNELink from '#components/justificatifs/extrait-rne-link';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import TVACell from '#components/tva-cell';
import { EAdministration } from '#models/administrations/EAdministration';
import { estActif } from '#models/core/etat-administratif';
import {
  getAdresseUniteLegale,
  getNomComplet,
} from '#models/core/statut-diffusion';
import {
  IUniteLegale,
  isAssociation,
  isServicePublic,
} from '#models/core/types';
import { ISession } from '#models/user/session';
import { formatDate, formatIntFr, formatSiret } from '#utils/helpers';
import { libelleCategorieEntreprise } from '#utils/helpers/formatting/categories-entreprise';
import { libelleTrancheEffectif } from '#utils/helpers/formatting/codes-effectifs';
import {
  LabelsAndCertificatesBadgesSection,
  checkHasLabelsAndCertificates,
  checkHasQuality,
  labelsAndCertificatesSources,
} from '../badges-section/labels-and-certificates';

const UniteLegaleSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const hasLabelsAndCertificates = checkHasLabelsAndCertificates(uniteLegale);

  const conventionsCollectives = Object.keys(
    uniteLegale.conventionsCollectives || {}
  );

  const data = [
    ['Dénomination', getNomComplet(uniteLegale, session)],
    ['SIREN', formatIntFr(uniteLegale.siren)],
    [
      'SIRET du siège social',
      uniteLegale.siege &&
        uniteLegale.siege.siret &&
        formatSiret((uniteLegale.siege || {}).siret),
    ],
    [
      <FAQLink
        tooltipLabel="N° TVA Intracommunautaire"
        to="/faq/tva-intracommunautaire"
      >
        Comprendre le numéro de TVA intracommunautaire
      </FAQLink>,
      <TVACell uniteLegale={uniteLegale} />,
    ],
    ['Activité principale (NAF/APE)', uniteLegale.libelleActivitePrincipale],
    ['Code NAF/APE', uniteLegale.activitePrincipale],
    [
      <FAQLink to="/faq/modifier-adresse" tooltipLabel="Adresse postale">
        Comment modifier une adresse ?
      </FAQLink>,
      getAdresseUniteLegale(uniteLegale, session, true),
    ],
    ['Nature juridique', uniteLegale.libelleNatureJuridique],
    [
      'Tranche effectif salarié de la structure',
      libelleTrancheEffectif(
        uniteLegale.trancheEffectif,
        uniteLegale.anneeTrancheEffectif
      ),
    ],
    ['Taille de la structure', libelleCategorieEntreprise(uniteLegale)],
    ['Date de création', formatDate(uniteLegale.dateCreation)],
    [
      'Dernière modification à l’Insee',
      formatDate(uniteLegale.dateMiseAJourInsee),
    ],
    ...(uniteLegale.dateMiseAJourInpi
      ? [
          [
            'Dernière modification à l’Inpi',
            formatDate(uniteLegale.dateMiseAJourInpi),
          ],
        ]
      : []),
    ...(!estActif(uniteLegale)
      ? [
          [
            'Date de fermeture',
            formatDate(
              uniteLegale.dateDebutActivite || uniteLegale.dateFermeture
            ),
          ],
        ]
      : []),
    ['', <br />],
    [
      'Convention(s) collective(s)',
      <ConventionCollectivesBadgesSection
        conventionCollectives={conventionsCollectives}
        siren={uniteLegale.siren}
      />,
    ],
    // jump line and add label and certificates
    ...(hasLabelsAndCertificates
      ? [
          ['', <br />],
          [
            `${
              checkHasQuality(uniteLegale) ? 'Qualités, l' : 'L'
            }abels et certificats`,
            <LabelsAndCertificatesBadgesSection uniteLegale={uniteLegale} />,
          ],
        ]
      : []),
    ['', <br />],
    [
      'Justificatif(s) d’existence',
      <ul>
        {isAssociation(uniteLegale) && (
          <li>
            Annonce de création au JOAFE :{' '}
            <a
              href={`/justificatif/${uniteLegale.siren}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              télécharger
            </a>
          </li>
        )}
        {uniteLegale.dateMiseAJourInpi && (
          <li>
            Extrait RNE (équivalent KBIS/D1) :{' '}
            <ExtraitRNELink uniteLegale={uniteLegale} session={session} />
          </li>
        )}
        {uniteLegale.dateMiseAJourInsee && (
          <li>
            Avis de situation Insee :{' '}
            <AvisSituationLink
              session={session}
              etablissement={uniteLegale.siege}
              label="télécharger"
            />
          </li>
        )}
      </ul>,
    ],
  ];

  return (
    <div id="entreprise">
      <Section
        title={`Informations légales de ${getNomComplet(uniteLegale, session)}`}
        sources={[
          EAdministration.INSEE,
          EAdministration.VIES,
          ...labelsAndCertificatesSources(uniteLegale),
          ...(isAssociation(uniteLegale)
            ? [EAdministration.DILA]
            : isServicePublic(uniteLegale)
            ? []
            : [EAdministration.INPI]),
          ...(conventionsCollectives.length > 0 ? [EAdministration.MTPEI] : []),
        ]}
        lastModified={uniteLegale.dateDerniereMiseAJour}
      >
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
    </div>
  );
};

export default UniteLegaleSection;
