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
import { Link } from "#/components/link";
import { Section } from "#/components/section";
import { TwoColumnTable } from "#/components/table/simple";
import TVACell from "#/components/tva-cell";
import FAQLink from "#/components-ui/faq-link";
import { Loader } from "#/components-ui/loader";
import { EAdministration } from "#/models/administrations/e-administration";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { estActif } from "#/models/core/etat-administratif";
import type { IFondation } from "#/models/core/fondations.types";
import {
  type IUniteLegale,
  isAssociation,
  isServicePublic,
} from "#/models/core/types";
import { formatDate, formatIntFr, formatSiret } from "#/utils/helpers";
import { libelleCategorieEntreprise } from "#/utils/helpers/formatting/categories-entreprise";
import { EffectifCell } from "../entreprise.$slug/effectif-cell";
import {
  UniteLegaleInscriptionIG,
  UniteLegaleInscriptionRNA,
  UniteLegaleInscriptionRNE,
  UniteLegaleInscriptionSirene,
} from "../entreprise.$slug/inscriptions";
import { UniteLegaleProcedureCollective } from "../entreprise.$slug/procedure-collective";
import { UniteLegaleRadiationRCS } from "../entreprise.$slug/radiation-rcs";
import { FondationInscriptionRNF } from "./inscriptions";

const FondationSummarySection: React.FC<{
  fondation: IFondation;
  uniteLegale: IUniteLegale | null;
  user: IAgentInfo | null;
}> = ({ fondation, uniteLegale, user }) => {
  const hasLabelsAndCertificates = uniteLegale
    ? checkHasLabelsAndCertificates(uniteLegale)
    : false;
  const conventionsCollectives = uniteLegale ? uniteLegale.listeIdcc : [];

  const data = [
    [
      <FAQLink tooltipLabel="État des inscriptions">
        Toutes les structures référencées sur notre site sont inscrites à un ou
        plusieurs référentiels publics (base Sirene, RNE, RNA).
        <br />
        <br />
        {uniteLegale?.dateMiseAJourInpi && (
          <>
            L’Extrait RNE est le justificatif d’immatriculation de l’entreprise.
            Il contient les mêmes données qu’un extrait KBIS/D1.
          </>
        )}
      </FAQLink>,
      [
        <>
          <FondationInscriptionRNF fondation={fondation} />
          {uniteLegale && (
            <>
              <UniteLegaleInscriptionSirene
                uniteLegale={uniteLegale}
                user={user}
              />
              <UniteLegaleInscriptionRNE
                uniteLegale={uniteLegale}
                user={user}
              />
              <UniteLegaleInscriptionIG uniteLegale={uniteLegale} />
              <UniteLegaleInscriptionRNA uniteLegale={uniteLegale} />
              <UniteLegaleRadiationRCS uniteLegale={uniteLegale} user={user} />
              <UniteLegaleProcedureCollective
                uniteLegale={uniteLegale}
                user={user}
              />
            </>
          )}
        </>,
      ],
    ],
    ["", <br />],
    ["Dénomination", fondation.title],
    ["Numéro RNF", fondation.id],
    ...(fondation.siren ? [["SIREN", formatIntFr(fondation.siren)]] : []),
    ...(fondation.siret
      ? [["SIRET du siège social", formatSiret(fondation.siret)]]
      : []),
    ...(uniteLegale
      ? [
          [
            <Link
              params={{ slug: "tva-intracommunautaire" }}
              to="/definitions/$slug"
            >
              N° TVA Intracommunautaire
            </Link>,
            <TVACell uniteLegale={uniteLegale} />,
          ],
        ]
      : []),
    ...(uniteLegale
      ? [
          [
            <FAQLink
              to="https://www.economie.gouv.fr/entreprises/numero-eori"
              tooltipLabel="N° EORI"
            >
              Le numéro EORI (Economic Operator Registration and Identification)
              est un identifiant unique communautaire permettant d’identifier
              l’entreprise dans ses relations avec les autorités douanières.
            </FAQLink>,
            uniteLegale.siege.siret ? (
              <EORICell siret={uniteLegale.siege.siret} />
            ) : (
              ""
            ),
          ],
        ]
      : []),
    ["Type organisme", formatFoundationType(fondation.foundationType)],
    ["Domaine d'intérêt", fondation.generalInterestDomain],
    ...(uniteLegale
      ? [
          [
            "Activité principale (NAF/APE)",
            uniteLegale.libelleActivitePrincipale,
          ],
        ]
      : []),
    ...(uniteLegale ? [["Code NAF/APE", uniteLegale.activitePrincipale]] : []),
    ...(uniteLegale
      ? [
          [
            <FAQLink tooltipLabel="Activité principale (NAF 2025)">
              Le code NAF 2025 est une variable issue de la nouvelle
              nomenclature d’activités de l’Insee. Il sera applicable à partir
              du 1ᵉʳ janvier 2027 et coexistera jusqu’en fin 2026 avec la NAF
              actuellement en vigueur.
              <br />
              <br />
              <a
                href="https://www.insee.fr/fr/information/8181066"
                rel="noopener noreferrer"
                target="_blank"
              >
                En savoir plus sur la nomenclature NAF 2025 sur le site de
                l’Insee
              </a>
            </FAQLink>,
            uniteLegale.libelleActivitePrincipaleNaf25,
          ],
        ]
      : []),
    [
      <Link params={{ slug: "modifier-adresse" }} to="/faq/$slug">
        Adresse postale
      </Link>,
      fondation.address,
    ],
    ...(uniteLegale
      ? [["Forme juridique", uniteLegale.libelleNatureJuridique]]
      : []),
    ...(uniteLegale
      ? [
          [
            <FAQLink tooltipLabel="Effectif salarié">
              L’effectif salarié est une variable qui s’affiche à partir de deux
              données de l’Insee : la tranche d’effectifs salariés, qui est une
              variable statistique (données arrêtées au 31/12 de l’année n-2),
              et le caractère employeur des établissements (données déclaratives
              maintenues par l'URSSAF).
            </FAQLink>,
            <EffectifCell uniteLegale={uniteLegale} user={user} />,
          ],
        ]
      : []),
    ...(uniteLegale
      ? [
          [
            <FAQLink
              to="https://www.insee.fr/fr/metadonnees/definition/c1057"
              tooltipLabel="Catégorie d'entreprise"
            >
              La catégorie d'entreprise est une variable statistique calculée
              par l'Insee. Lorsque l'unité légale appartient à un{" "}
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
              auquel appartient l'unité légale. Cette donnée n'est pas
              utilisable à des fins administratives.
            </FAQLink>,
            libelleCategorieEntreprise(uniteLegale),
          ],
        ]
      : []),
    ...(uniteLegale
      ? [["Date de création", formatDate(uniteLegale.dateCreation)]]
      : []),
    ...(uniteLegale && estActif(uniteLegale)
      ? []
      : uniteLegale
        ? [["Date de fermeture", formatDate(uniteLegale.dateFermeture)]]
        : []),
    ["", <br />],
    ...(uniteLegale
      ? [
          [
            "Convention(s) collective(s)",
            <ConventionCollectivesBadgesSection
              conventionCollectives={conventionsCollectives}
              siren={uniteLegale.siren}
            />,
          ],
        ]
      : []),
    // agents : we dont know yet if there are labels and certifs
    ...(uniteLegale &&
    hasRights({ user }, ApplicationRights.protectedCertificats)
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
      : uniteLegale && hasLabelsAndCertificates
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
        lastModified={uniteLegale?.dateDerniereMiseAJour}
        sources={[
          EAdministration.MI,
          ...(uniteLegale
            ? [
                EAdministration.INSEE,
                EAdministration.DGFIP,
                EAdministration.DOUANES,
              ]
            : []),
          ...(uniteLegale ? labelsAndCertificatesSources(uniteLegale) : []),
          ...(uniteLegale && isAssociation(uniteLegale)
            ? [EAdministration.DILA]
            : uniteLegale && isServicePublic(uniteLegale)
              ? []
              : [EAdministration.INPI]),
          ...(conventionsCollectives.length > 0 ? [EAdministration.MTPEI] : []),
          ...(hasRights({ user }, ApplicationRights.effectifs)
            ? [EAdministration.GIP_MDS]
            : []),
        ]}
        title={`Informations légales de ${fondation.title}`}
      >
        <TwoColumnTable body={data} />
      </Section>
    </div>
  );
};

function formatFoundationType(type: string) {
  switch (type) {
    case "FDD":
      return "Fond de dotation";
    case "FE":
      return "Fondation d'entreprise";
    case "FA":
      return "Fondation abritée";
    case "FRUP":
      return "Fondation reconnue d’utilité publique";
    case "FCS":
    case "FH":
    case "FP":
    case "FU":
      return `Fondation scientifique (${type})`;
    default:
      return type;
  }
}

export default FondationSummarySection;
