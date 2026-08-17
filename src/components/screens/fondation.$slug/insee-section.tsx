import type React from "react";
import { ConventionCollectivesBadgesSection } from "#/components/badges-section/convention-collectives";
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
import type { IUniteLegale } from "#/models/core/types";
import { formatDate } from "#/utils/helpers";
import { libelleCategorieEntreprise } from "#/utils/helpers/formatting/categories-entreprise";
import { EffectifCell } from "../entreprise.$slug/effectif-cell";

const FondationInseeSection: React.FC<{
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}> = ({ uniteLegale, user }) => {
  const conventionsCollectives = uniteLegale ? uniteLegale.listeIdcc : [];

  const data = [
    ["Dénomination", uniteLegale.nomComplet],
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
  ];

  return (
    <div id="fondation-insee">
      <Section
        lastModified={uniteLegale?.dateDerniereMiseAJour}
        sources={[
          EAdministration.INSEE,
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
