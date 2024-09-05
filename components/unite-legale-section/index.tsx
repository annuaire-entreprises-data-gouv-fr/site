import FAQLink from '#components-ui/faq-link';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { ConventionCollectivesBadgesSection } from '#components/badges-section/convention-collectives';
import { ProtectedCertificatesBadgesSection } from '#components/badges-section/labels-and-certificates/protected-certificats';
import EORICell from '#components/eori-cell';
import AvisSituationLink from '#components/justificatifs/avis-situation-link';
import ExtraitRNELink from '#components/justificatifs/extrait-rne-link';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import TVACell from '#components/tva-cell';
import { EAdministration } from '#models/administrations/EAdministration';
import { estActif } from '#models/core/etat-administratif';
import {
  IUniteLegale,
  isAssociation,
  isServicePublic,
} from '#models/core/types';
import { AppScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { formatDate, formatIntFr, formatSiret } from '#utils/helpers';
import { libelleCategorieEntreprise } from '#utils/helpers/formatting/categories-entreprise';
import { libelleTrancheEffectif } from '#utils/helpers/formatting/codes-effectifs';
import React from 'react';
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
  const conventionsCollectives = uniteLegale.listeIdcc;

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
      <a href="/faq/tva-intracommunautaire">N° TVA Intracommunautaire</a>,
      <TVACell uniteLegale={uniteLegale} />,
    ],
    [
      <FAQLink
        tooltipLabel="N° EORI"
        to="https://www.economie.gouv.fr/entreprises/numero-eori"
      >
        Le numéro EORI (Economic Operator Registration and Identification) est
        un identifiant unique communautaire permettant d’identifier l’entreprise
        dans ses relations avec les autorités douanières.
      </FAQLink>,
      <EORICell uniteLegale={uniteLegale} session={session} />,
    ],
    ['Activité principale (NAF/APE)', uniteLegale.libelleActivitePrincipale],
    ['Code NAF/APE', uniteLegale.activitePrincipale],
    [
      <a href="/faq/modifier-adresse">Adresse postale</a>,
      uniteLegale.siege.adressePostale,
    ],
    ['Nature juridique', uniteLegale.libelleNatureJuridique],
    [
      'Tranche effectif salarié de la structure',
      libelleTrancheEffectif(
        uniteLegale.trancheEffectif,
        uniteLegale.anneeTrancheEffectif
      ),
    ],
    [
      <FAQLink
        tooltipLabel="Taille de la structure"
        to="https://www.insee.fr/fr/metadonnees/definition/c1057"
      >
        La taille de l’entreprise, ou catégorie d’entreprise, est une variable
        statistique calculée par l’Insee sur la base de l’effectif, du chiffre
        d’affaires et du total du bilan.
      </FAQLink>,
      libelleCategorieEntreprise(uniteLegale),
    ],
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
      ? [['Date de fermeture', formatDate(uniteLegale.dateFermeture)]]
      : []),
    ['', <br />],
    [
      'Convention(s) collective(s)',
      <ConventionCollectivesBadgesSection
        conventionCollectives={conventionsCollectives}
        siren={uniteLegale.siren}
      />,
    ],
    // agents : we dont know yet if there are labels and certifs
    ...(hasRights(session, AppScope.protectedCertificats)
      ? [
          ['', <br />],
          [
            `${
              checkHasQuality(uniteLegale) ? 'Qualités, l' : 'L'
            }abels et certificats`,
            <ProtectedCertificatesBadgesSection
              session={session}
              uniteLegale={uniteLegale}
            />,
          ],
        ]
      : hasLabelsAndCertificates
      ? [
          ['', <br />],
          [
            `${
              checkHasQuality(uniteLegale) ? 'Qualités, l' : 'L'
            }abels et certificats`,
            <LabelsAndCertificatesBadgesSection uniteLegale={uniteLegale} />,
          ],
        ]
      : //  open data and no certif : we can hide the whole line
        []),
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
            Extrait RNE (<a href="/faq/extrait-kbis">équivalent KBIS/D1</a>) :{' '}
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
        title={`Informations légales de ${uniteLegale.nomComplet}`}
        sources={[
          EAdministration.INSEE,
          EAdministration.VIES,
          EAdministration.DOUANES,
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
