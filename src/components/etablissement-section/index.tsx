import type React from "react";
import { ConventionCollectivesBadgesSection } from "#/components/badges-section/convention-collectives";
import { labelsAndCertificatesSources } from "#/components/badges-section/labels-and-certificates";
import AvisSituationLink from "#/components/justificatifs/avis-situation-link";
import ExtraitRNELink from "#/components/justificatifs/extrait-rne-link";
import { Link } from "#/components/Link";
import { Section } from "#/components/section";
import { CopyPaste } from "#/components/table/copy-paste";
import { TwoColumnTable } from "#/components/table/simple";
import FAQLink from "#/components-ui/faq-link";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import BreakPageForPrint from "#/components-ui/print-break-page";
import { PrintNever } from "#/components-ui/print-visibility";
import { Tag } from "#/components-ui/tag";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import { estActif } from "#/models/core/etat-administratif";
import type { IEtablissement, IUniteLegale } from "#/models/core/types";
import {
  formatDate,
  formatSiret,
  uniteLegaleLabelWithPronounContracted,
} from "#/utils/helpers";

interface IProps {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  usedInEntreprisePage?: boolean;
  user: IAgentInfo | null;
  withDenomination?: boolean;
}

const EtablissementSection: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  usedInEntreprisePage,
  withDenomination,
  user,
}) => {
  const uniteLegaleLabel = `${uniteLegaleLabelWithPronounContracted(
    uniteLegale
  )}`;

  const data = [
    ...(withDenomination
      ? [
          [`Dénomination ${uniteLegaleLabel}`, uniteLegale.nomComplet],
          [
            "Type d’établissement",
            <>
              {etablissement.estSiege ? (
                <Tag color="info">siège social</Tag>
              ) : etablissement.ancienSiege ? (
                <Tag>ancien siège social</Tag>
              ) : (
                <Tag>secondaire</Tag>
              )}
              {" ( "}
              <Link href={`/entreprise/${uniteLegale.chemin}`} key="entite">
                → voir la page {uniteLegaleLabel}
              </Link>
              {" )"}
            </>,
          ],
        ]
      : []),
    ...(etablissement.enseigne
      ? [["Enseigne de l’établissement", etablissement.enseigne]]
      : []),
    ...(etablissement.denomination
      ? [["Nom de l’établissement", etablissement.denomination]]
      : []),
    [
      <Link href="/faq/modifier-adresse">Adresse</Link>,
      etablissement.adresse ? (
        <CopyPaste label="Adresse">{etablissement.adresse}</CopyPaste>
      ) : (
        ""
      ),
    ],
    ["SIRET", formatSiret(etablissement.siret)],
    ["Clef NIC", etablissement.nic],
    ...(usedInEntreprisePage
      ? []
      : [
          [
            <Link href="/faq/tva-intracommunautaire">
              N° TVA Intracommunautaire
            </Link>,
            <PrintNever key="siege-social-link">
              <Link href={`/entreprise/${uniteLegale.chemin}`} key="entite">
                → voir la page {uniteLegaleLabel}
              </Link>
            </PrintNever>,
          ],
        ]),
    [
      `Activité principale ${uniteLegaleLabel} (NAF/APE)`,
      uniteLegale.libelleActivitePrincipale,
    ],
    [
      "Activité principale de l’établissement (NAF/APE)",
      etablissement.libelleActivitePrincipale,
    ],
    ["Code NAF/APE de l’établissement", etablissement.activitePrincipale],
    [
      <FAQLink tooltipLabel="Activité principale de l’établissement (NAF 2025)">
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
      etablissement.libelleActivitePrincipaleNaf25,
    ],
    ["Forme juridique", uniteLegale.libelleNatureJuridique],
    [
      `Date de création ${uniteLegaleLabel}`,
      formatDate(uniteLegale.dateCreation),
    ],
    [
      "Date de création de l’établissement",
      formatDate(etablissement.dateCreation),
    ],
    ...(etablissement.dateMiseAJourInsee
      ? [
          [
            "Dernière modification des données Insee",
            formatDate(etablissement.dateMiseAJourInsee),
          ],
        ]
      : []),
    ...(estActif(etablissement)
      ? []
      : [["Date de fermeture", formatDate(etablissement.dateFermeture || "")]]),
    ["", <br />],
    ...(etablissement.listeIdcc
      ? [
          [
            "Convention collective de l’établissement",
            [
              <ConventionCollectivesBadgesSection
                conventionCollectives={etablissement.listeIdcc}
                key="convention-collectives"
                siren={uniteLegale.siren}
              />,
            ],
          ],
          ["", <br />],
        ]
      : []),
    [
      "Justificatif(s) d’existence",
      etablissement.siret ? (
        <>
          Avis de situation Insee de cet établissement :{" "}
          <AvisSituationLink
            button={true}
            etablissement={etablissement}
            label="télécharger"
            user={user}
          />
          {!usedInEntreprisePage && uniteLegale.dateMiseAJourInpi && (
            <>
              <br />
              Extrait RNE {uniteLegaleLabel} (
              <Link href="/faq/extrait-kbis">équivalent KBIS/D1</Link>) :{" "}
              <ExtraitRNELink uniteLegale={uniteLegale} user={user} />
            </>
          )}
        </>
      ) : (
        ""
      ),
    ],
  ];

  return (
    <>
      <Section
        id="etablissement"
        lastModified={etablissement.dateDerniereMiseAJour}
        sources={[
          EAdministration.INSEE,
          EAdministration.VIES,
          ...labelsAndCertificatesSources(uniteLegale),
        ]}
        title={
          usedInEntreprisePage
            ? `Siège social de ${uniteLegale.nomComplet}`
            : `Information légales de l’établissement ${
                etablissement.enseigne ||
                etablissement.denomination ||
                uniteLegale.nomComplet
              }${etablissement.commune ? ` à ${etablissement.commune}` : ""}`
        }
      >
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
      <BreakPageForPrint />
    </>
  );
};
export default EtablissementSection;
