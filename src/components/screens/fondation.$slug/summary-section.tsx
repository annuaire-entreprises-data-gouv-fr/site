import type React from "react";
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
import ClampedText from "#/components-ui/clamped-text";
import FAQLink from "#/components-ui/faq-link";
import { EAdministration } from "#/models/administrations/e-administration";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { estActif } from "#/models/core/etat-administratif";
import type { IFondation } from "#/models/core/fondations.types";
import type { IUniteLegale } from "#/models/core/types";
import { formatDate, formatIntFr, formatSiret } from "#/utils/helpers";
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
    [
      <Link params={{ slug: "modifier-adresse" }} to="/faq/$slug">
        Adresse postale
      </Link>,
      fondation.address,
    ],
    ...(uniteLegale
      ? [["Date de création", formatDate(fondation.creationDate)]]
      : []),
    ...(uniteLegale && estActif(uniteLegale)
      ? []
      : uniteLegale
        ? [["Date de fermeture", formatDate(uniteLegale.dateFermeture)]]
        : []),
    ["Objet social", <ClampedText>{fondation.socialObject}</ClampedText>],
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
    <div id="entreprise">
      <Section
        lastModified={uniteLegale?.dateDerniereMiseAJour}
        sources={[
          EAdministration.MI,
          EAdministration.DGFIP,
          EAdministration.DOUANES,
          ...(uniteLegale ? labelsAndCertificatesSources(uniteLegale) : []),
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
