import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { ConventionCollectivesBadgesSection } from '#components/badges-section/convention-collectives';
import { ProtectedCertificatesBadgesSection } from '#components/badges-section/labels-and-certificates/protected-certificats';
import EORICell from '#components/eori-cell';
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
import {
  LabelsAndCertificatesBadgesSection,
  checkHasLabelsAndCertificates,
  checkHasQuality,
  labelsAndCertificatesSources,
} from '../../../../../components/badges-section/labels-and-certificates';
import {
  UniteLegaleInscriptionIG,
  UniteLegaleInscriptionRNA,
  UniteLegaleInscriptionRNE,
  UniteLegaleInscriptionSirene,
} from './inscriptions';

const UniteLegaleSummarySection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const hasLabelsAndCertificates = checkHasLabelsAndCertificates(uniteLegale);
  const conventionsCollectives = uniteLegale.listeIdcc;

  const data = [
    [
      <FAQLink tooltipLabel="État des inscriptions">
        Toutes les structures référencées sur notre site sont inscrites à un ou
        plusieurs référentiels publics (base Sirene, RNE, RNA).
        <br />
        <br />
        {uniteLegale.dateMiseAJourInpi && (
          <>
            L’Extrait RNE est le justificatif d’immatriculation de l’entreprise.
            Il contient les mêmes données qu’un extrait KBIS/D1.
          </>
        )}
      </FAQLink>,
      <>
        <UniteLegaleInscriptionSirene
          uniteLegale={uniteLegale}
          session={session}
        />
        <UniteLegaleInscriptionRNE
          uniteLegale={uniteLegale}
          session={session}
        />
        <UniteLegaleInscriptionIG uniteLegale={uniteLegale} />
        <UniteLegaleInscriptionRNA uniteLegale={uniteLegale} />
      </>,
    ],
    ['', <br />],
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
      uniteLegale.siege.siret ? (
        <EORICell siret={uniteLegale.siege.siret} session={session} />
      ) : (
        ''
      ),
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
    </div>
  );
};

export default UniteLegaleSummarySection;
