import type React from "react";
import { ConventionCollectivesBadgesSection } from "#components/badges-section/convention-collectives";
import { labelsAndCertificatesSources } from "#components/badges-section/labels-and-certificates";
import AvisSituationLink from "#components/justificatifs/avis-situation-link";
import ExtraitRNELink from "#components/justificatifs/extrait-rne-link";
import { Section } from "#components/section";
import { CopyPaste } from "#components/table/copy-paste";
import { TwoColumnTable } from "#components/table/simple";
import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import BreakPageForPrint from "#components-ui/print-break-page";
import { PrintNever } from "#components-ui/print-visibility";
import { Tag } from "#components-ui/tag";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import { estActif } from "#models/core/etat-administratif";
import type { IEtablissement, IUniteLegale } from "#models/core/types";
import {
  formatDate,
  formatSiret,
  uniteLegaleLabelWithPronounContracted,
} from "#utils/helpers";
import { libelleTrancheEffectif } from "#utils/helpers/formatting/codes-effectifs";

type IProps = {
  session: ISession | null;
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  usedInEntreprisePage?: boolean;
  withDenomination?: boolean;
};

const EtablissementSection: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  usedInEntreprisePage,
  withDenomination,
  session,
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
              <a href={`/entreprise/${uniteLegale.chemin}`} key="entite">
                → voir la page {uniteLegaleLabel}
              </a>
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
      <a href="/faq/modifier-adresse">Adresse</a>,
      etablissement.adresse ? (
        <CopyPaste label="Adresse">{etablissement.adresse}</CopyPaste>
      ) : (
        ""
      ),
    ],
    ["SIRET", formatSiret(etablissement.siret)],
    ["Clef NIC", etablissement.nic],
    ...(!usedInEntreprisePage
      ? [
          [
            <a href="/faq/tva-intracommunautaire">N° TVA Intracommunautaire</a>,
            <PrintNever key="siege-social-link">
              <a href={`/entreprise/${uniteLegale.chemin}`} key="entite">
                → voir la page {uniteLegaleLabel}
              </a>
            </PrintNever>,
          ],
        ]
      : []),
    [
      `Activité principale ${uniteLegaleLabel} (NAF/APE)`,
      uniteLegale.libelleActivitePrincipale,
    ],
    [
      `Activité principale de l’établissement (NAF/APE)`,
      etablissement.libelleActivitePrincipale,
    ],
    ["Code NAF/APE de l’établissement", etablissement.activitePrincipale],
    ["Forme juridique", uniteLegale.libelleNatureJuridique],
    [
      "Tranche d’effectif salarié",
      libelleTrancheEffectif(
        uniteLegale.trancheEffectif === "N"
          ? "N"
          : etablissement.trancheEffectif,
        etablissement.anneeTrancheEffectif
      ),
    ],
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
    ...(!estActif(etablissement)
      ? [["Date de fermeture", formatDate(etablissement.dateFermeture || "")]]
      : []),
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
            session={session}
          />
          {!usedInEntreprisePage && uniteLegale.dateMiseAJourInpi && (
            <>
              <br />
              Extrait RNE {uniteLegaleLabel} (
              <a href="/faq/extrait-kbis">équivalent KBIS/D1</a>) :{" "}
              <ExtraitRNELink session={session} uniteLegale={uniteLegale} />
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
