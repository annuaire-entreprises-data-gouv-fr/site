import type React from "react";
import { Suspense } from "react";
import { ConventionCollectivesBadgesSection } from "#components/badges-section/convention-collectives";
import {
  checkHasLabelsAndCertificates,
  checkHasQuality,
  LabelsAndCertificatesBadgesSection,
  labelsAndCertificatesSources,
} from "#components/badges-section/labels-and-certificates";
import { ProtectedCertificatesBadgesSection } from "#components/badges-section/labels-and-certificates/protected-certificats";
import EORICell from "#components/eori-cell";
import { Section } from "#components/section";
import { TwoColumnTable } from "#components/table/simple";
import TVACell from "#components/tva-cell";
import FAQLink from "#components-ui/faq-link";
import { Loader } from "#components-ui/loader";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { estActif } from "#models/core/etat-administratif";
import {
  type IUniteLegale,
  isAssociation,
  isServicePublic,
} from "#models/core/types";
import { formatDate, formatIntFr, formatSiret } from "#utils/helpers";
import { libelleCategorieEntreprise } from "#utils/helpers/formatting/categories-entreprise";
import { EffectifCell } from "./effectif-cell";
import {
  UniteLegaleInscriptionIG,
  UniteLegaleInscriptionRNA,
  UniteLegaleInscriptionRNE,
  UniteLegaleInscriptionSirene,
} from "./inscriptions";

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
          session={session}
          uniteLegale={uniteLegale}
        />
        <UniteLegaleInscriptionRNE
          session={session}
          uniteLegale={uniteLegale}
        />
        <UniteLegaleInscriptionIG uniteLegale={uniteLegale} />
        <UniteLegaleInscriptionRNA uniteLegale={uniteLegale} />
      </>,
    ],
    ["", <br />],
    ["Dénomination", uniteLegale.nomComplet],
    ["SIREN", formatIntFr(uniteLegale.siren)],
    [
      "SIRET du siège social",
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
        to="https://www.economie.gouv.fr/entreprises/numero-eori"
        tooltipLabel="N° EORI"
      >
        Le numéro EORI (Economic Operator Registration and Identification) est
        un identifiant unique communautaire permettant d’identifier l’entreprise
        dans ses relations avec les autorités douanières.
      </FAQLink>,
      uniteLegale.siege.siret ? (
        <EORICell siret={uniteLegale.siege.siret} />
      ) : (
        ""
      ),
    ],
    ["Activité principale (NAF/APE)", uniteLegale.libelleActivitePrincipale],
    ["Code NAF/APE", uniteLegale.activitePrincipale],
    [
      <a href="/faq/modifier-adresse">Adresse postale</a>,
      uniteLegale.siege.adressePostale,
    ],
    ["Forme juridique", uniteLegale.libelleNatureJuridique],
    [
      <FAQLink tooltipLabel="Effectif salarié">
        L’effectif salarié est une variable qui s’affiche à partir de deux
        données de l’Insee : la tranche d’effectifs salariés, qui est une
        variable statistique (données arrêtées au 31/12 de l’année n-2), et le
        caractère employeur des établissements (données déclaratives maintenues
        par l'URSSAF).
      </FAQLink>,
      <EffectifCell session={session} uniteLegale={uniteLegale} />,
    ],
    [
      <FAQLink
        to="https://www.insee.fr/fr/metadonnees/definition/c1057"
        tooltipLabel="Taille de la structure"
      >
        La taille de l’entreprise, ou catégorie d’entreprise, est une variable
        statistique calculée par l’Insee sur la base de l’effectif, du chiffre
        d’affaires et du total du bilan.
      </FAQLink>,
      libelleCategorieEntreprise(uniteLegale),
    ],
    ["Date de création", formatDate(uniteLegale.dateCreation)],
    ...(estActif(uniteLegale)
      ? []
      : [["Date de fermeture", formatDate(uniteLegale.dateFermeture)]]),
    ["", <br />],
    [
      "Convention(s) collective(s)",
      <ConventionCollectivesBadgesSection
        conventionCollectives={conventionsCollectives}
        siren={uniteLegale.siren}
      />,
    ],
    // agents : we dont know yet if there are labels and certifs
    ...(hasRights(session, ApplicationRights.protectedCertificats)
      ? [
          ["", <br />],
          [
            `${
              checkHasQuality(uniteLegale) ? "Qualités, l" : "L"
            }abels et certificats`,
            <Suspense fallback={<Loader />}>
              <ProtectedCertificatesBadgesSection uniteLegale={uniteLegale} />
            </Suspense>,
          ],
        ]
      : hasLabelsAndCertificates
        ? [
            ["", <br />],
            [
              `${
                checkHasQuality(uniteLegale) ? "Qualités, l" : "L"
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
        lastModified={uniteLegale.dateDerniereMiseAJour}
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
          ...(hasRights(session, ApplicationRights.effectifsAnnuels)
            ? [EAdministration.GIP_MDS]
            : []),
        ]}
        title={`Informations légales de ${uniteLegale.nomComplet}`}
      >
        <TwoColumnTable body={data} />
      </Section>
    </div>
  );
};

export default UniteLegaleSummarySection;
