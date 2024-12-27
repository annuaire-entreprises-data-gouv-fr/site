import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { PrintNever } from '#components-ui/print-visibility';
import { ConventionCollectivesBadgesSection } from '#components/badges-section/convention-collectives';
import { labelsAndCertificatesSources } from '#components/badges-section/labels-and-certificates';
import AvisSituationLink from '#components/justificatifs/avis-situation-link';
import { Section } from '#components/section';
import { CopyPaste } from '#components/table/copy-paste';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { estActif } from '#models/core/etat-administratif';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import {
  formatDate,
  formatSiret,
  uniteLegaleLabelWithPronounContracted,
} from '#utils/helpers';
import { libelleTrancheEffectif } from '#utils/helpers/formatting/codes-effectifs';
import React from 'react';

type IProps = {
  session: ISession | null;
  uniteLegale: IUniteLegale;
};

export const EtablissementSiegeSection: React.FC<IProps> = ({
  uniteLegale,
  session,
}) => {
  const uniteLegaleLabel = `${uniteLegaleLabelWithPronounContracted(
    uniteLegale
  )}`;

  const siege = uniteLegale.siege;

  const data = [
    ...(siege.enseigne
      ? [['Enseigne de l’établissement', siege.enseigne]]
      : []),
    ...(siege.denomination
      ? [['Nom de l’établissement', siege.denomination]]
      : []),
    [
      <a href="/faq/modifier-adresse">Adresse</a>,
      siege.adresse ? (
        <>
          <CopyPaste label="Adresse">{siege.adresse}</CopyPaste>
          <PrintNever key="adresse-link">
            <a href={`/carte/${siege.siret}`}>→ voir sur la carte</a>
            <br />
            <br />
          </PrintNever>
        </>
      ) : (
        ''
      ),
    ],
    ['SIRET', formatSiret(siege.siret)],
    ['Clef NIC', siege.nic],
    [
      `Activité principale ${uniteLegaleLabel} (NAF/APE)`,
      uniteLegale.libelleActivitePrincipale,
    ],
    [`Activité principale du siège (NAF/APE)`, siege.libelleActivitePrincipale],
    ['Code NAF/APE de l’établissement', siege.activitePrincipale],
    [
      'Tranche d’effectif salarié',
      libelleTrancheEffectif(
        uniteLegale.trancheEffectif === 'N' ? 'N' : siege.trancheEffectif,
        siege.anneeTrancheEffectif
      ),
    ],

    ['Date de création du siège', formatDate(siege.dateCreation)],
    ...(siege.dateMiseAJourInsee
      ? [
          [
            'Dernière modification des données Insee',
            formatDate(siege.dateMiseAJourInsee),
          ],
        ]
      : []),
    ...(!estActif(siege)
      ? [['Date de fermeture', formatDate(siege.dateFermeture || '')]]
      : []),
    ['', <br />],
    ...(siege.complements.idcc && siege.complements.idcc.length > 0
      ? [
          [
            'Convention collective de l’établissement',
            [
              <ConventionCollectivesBadgesSection
                conventionCollectives={siege.complements.idcc}
                siren={uniteLegale.siren}
              />,
            ],
          ],
          ['', <br />],
        ]
      : []),
    [
      'Justificatif(s) d’existence',
      siege.siret ? (
        <>
          Avis de situation Insee de cet établissement :{' '}
          <AvisSituationLink
            session={session}
            etablissement={siege}
            label="télécharger"
            button={true}
          />
        </>
      ) : (
        ''
      ),
    ],
  ];

  return (
    <>
      <Section
        title={`Siège social de ${uniteLegale.nomComplet}`}
        id="etablissement"
        sources={[
          EAdministration.INSEE,
          EAdministration.VIES,
          ...labelsAndCertificatesSources(uniteLegale),
        ]}
        lastModified={siege.dateDerniereMiseAJour}
      >
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
      <BreakPageForPrint />
    </>
  );
};
