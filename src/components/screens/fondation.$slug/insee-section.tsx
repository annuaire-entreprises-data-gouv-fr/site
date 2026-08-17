import type React from "react";
import { ConventionCollectivesBadgesSection } from "#/components/badges-section/convention-collectives";
import {
  checkHasLabelsAndCertificates,
  checkHasQuality,
  LabelsAndCertificatesBadgesSection,
  labelsAndCertificatesSources,
} from "#/components/badges-section/labels-and-certificates";
import { ProtectedCertificatesBadgesSection } from "#/components/badges-section/labels-and-certificates/protected-certificats";
import { Section } from "#/components/section";
import { TwoColumnTable } from "#/components/table/simple";
import FAQLink from "#/components-ui/faq-link";
import { EAdministration } from "#/models/administrations/e-administration";
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
import { formatDate } from "#/utils/helpers";
import { libelleCategorieEntreprise } from "#/utils/helpers/formatting/categories-entreprise";
import { EffectifCell } from "../entreprise.$slug/effectif-cell";

const FondationInseeSection: React.FC<{
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}> = ({ uniteLegale, user }) => {
  const hasLabelsAndCertificates = uniteLegale
    ? checkHasLabelsAndCertificates(uniteLegale)
    : false;
  const conventionsCollectives = uniteLegale ? uniteLegale.listeIdcc : [];

  const data = [
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
            <ProtectedCertificatesBadgesSection uniteLegale={uniteLegale} />,
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
    <div id="fondation-insee">
      <Section
        lastModified={uniteLegale?.dateDerniereMiseAJour}
        sources={[
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
        title="Répertoire Sirene"
      >
        <TwoColumnTable body={data} />
      </Section>
    </div>
  );
};

export default FondationInseeSection;
