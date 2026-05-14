import type React from "react";
import { Suspense } from "react";
import { ConventionCollectivesBadgesSection } from "#/components/badges-section/convention-collectives";
import {
  checkHasLabelsAndCertificates,
  checkHasQuality,
  LabelsAndCertificatesBadgesSection,
  labelsAndCertificatesSources,
} from "#/components/badges-section/labels-and-certificates";
import { ProtectedCertificatesBadgesSection } from "#/components/badges-section/labels-and-certificates/protected-certificats";
import EORICell from "#/components/eori-cell";
import { Link } from "#/components/Link";
import { Section } from "#/components/section";
import { TwoColumnTable } from "#/components/table/simple";
import TVACell from "#/components/tva-cell";
import FAQLink from "#/components-ui/faq-link";
import { Loader } from "#/components-ui/loader";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { estActif } from "#/models/core/etat-administratif";
import {
  type IUniteLegale,
  isAssociation,
  isServicePublic,
} from "#/models/core/types";
import { formatDate, formatIntFr, formatSiret } from "#/utils/helpers";
import { libelleCategorieEntreprise } from "#/utils/helpers/formatting/categories-entreprise";
import { EffectifCell } from "./effectif-cell";
import {
  UniteLegaleInscriptionIG,
  UniteLegaleInscriptionRNA,
  UniteLegaleInscriptionRNE,
  UniteLegaleInscriptionSirene,
} from "./inscriptions";
import { UniteLegaleProcedureCollective } from "./procedure-collective";
import { UniteLegaleRadiationRCS } from "./radiation-rcs";

const UniteLegaleSummarySection: React.FC<{
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}> = ({ uniteLegale, user }) => {
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
        <UniteLegaleInscriptionSirene uniteLegale={uniteLegale} user={user} />
        <UniteLegaleInscriptionRNE uniteLegale={uniteLegale} user={user} />
        <UniteLegaleInscriptionIG uniteLegale={uniteLegale} />
        <UniteLegaleInscriptionRNA uniteLegale={uniteLegale} />
        <UniteLegaleRadiationRCS uniteLegale={uniteLegale} user={user} />
        <UniteLegaleProcedureCollective uniteLegale={uniteLegale} user={user} />
      </>,
    ],
    ["", <br />],
    ["Dénomination", uniteLegale.nomComplet],
    ["SIREN", formatIntFr(uniteLegale.siren)],
    [
      "SIRET du siège social",
      uniteLegale.siege?.siret && formatSiret(uniteLegale.siege?.siret),
    ],
    [
      <Link params={{ slug: "tva-intracommunautaire" }} to="/faq/$slug">
        N° TVA Intracommunautaire
      </Link>,
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
        <EORICell siret={uniteLegale.siege.siret} user={user} />
      ) : (
        ""
      ),
    ],
    ["Activité principale (NAF/APE)", uniteLegale.libelleActivitePrincipale],
    ["Code NAF/APE", uniteLegale.activitePrincipale],
    [
      <FAQLink tooltipLabel="Activité principale (NAF 2025)">
        Le code NAF 2025 est une variable issue de la nouvelle nomenclature
        d’activités de l’Insee. Il sera applicable à partir du 1ᵉʳ janvier 2027
        et coexistera jusqu’en fin 2026 avec la NAF actuellement en vigueur.
        <br />
        <br />
        <a
          href="https://www.insee.fr/fr/information/8181066"
          rel="noopener noreferrer"
          target="_blank"
        >
          En savoir plus sur la nomenclature NAF 2025 sur le site de l’Insee
        </a>
      </FAQLink>,
      uniteLegale.libelleActivitePrincipaleNaf25,
    ],
    [
      <Link params={{ slug: "modifier-adresse" }} to="/faq/$slug">
        Adresse postale
      </Link>,
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
      <EffectifCell uniteLegale={uniteLegale} user={user} />,
    ],
    [
      <FAQLink
        to="https://www.insee.fr/fr/metadonnees/definition/c1057"
        tooltipLabel="Catégorie d'entreprise"
      >
        La catégorie d'entreprise est une variable statistique calculée par
        l'Insee. Lorsque l'unité légale appartient à un{" "}
        <a
          href="https://www.insee.fr/fr/metadonnees/definition/c1041"
          rel="noopener noreferrer"
          target="_blank"
        >
          groupe
        </a>
        , la donnée est{" "}
        <a
          href="https://www.insee.fr/fr/metadonnees/definition/c1057"
          rel="noopener noreferrer"
          target="_blank"
        >
          calculée au niveau du groupe
        </a>{" "}
        auquel appartient l'unité légale. Cette donnée n'est pas utilisable à
        des fins administratives.
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
    ...(hasRights({ user }, ApplicationRights.protectedCertificats)
      ? [
          ["", <br />],
          [
            `${
              checkHasQuality(uniteLegale) ? "Qualités, l" : "L"
            }abels et certificats`,
            <Suspense fallback={<Loader />}>
              <ProtectedCertificatesBadgesSection
                uniteLegale={uniteLegale}
                user={user}
              />
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
          ...(hasRights({ user }, ApplicationRights.effectifs)
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
