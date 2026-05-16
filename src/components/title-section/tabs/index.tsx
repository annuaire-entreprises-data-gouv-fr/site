import type { ComponentProps } from "react";
import {
  checkHasLabelsAndCertificates,
  checkHasQuality,
} from "#/components/badges-section/labels-and-certificates";
import { Link } from "#/components/Link";
import { PrintNever } from "#/components-ui/print-visibility";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import {
  hasAidesFinancieres,
  type IUniteLegale,
  isCollectiviteTerritoriale,
  isEntrepreneurIndividuel,
  isServicePublic,
} from "#/models/core/types";
import styles from "./styles.module.css";
import TabLink from "./tab-link";

export enum FICHE {
  INFORMATION = "résumé",
  DOCUMENTS = "documents",
  ACTES = "actes & statuts",
  ANNONCES = "annonces",
  FINANCES = "finances",
  CERTIFICATS = "Labels ou certifications",
  COMPTES = "bilans & comptes",
  DIRIGEANTS = "dirigeants",
  DIVERS = "conventions collectives",
  ETABLISSEMENTS_SCOLAIRES = "établissements scolaires",
  ETABLISSEMENT = "fiche établissement",
}

interface ITab {
  ficheType: FICHE;
  label: string;
  noFollow: boolean;
  params: ComponentProps<typeof Link>["params"];
  shouldDisplay: boolean;
  to: ComponentProps<typeof Link>["to"];
  width?: string;
}

const getUniteLegaleTabs = (
  uniteLegale: IUniteLegale,
  user: IAgentInfo | null
): ITab[] => {
  const shouldDisplayFinances =
    // hide for public services
    (!isServicePublic(uniteLegale) &&
      // hide for EI
      !isEntrepreneurIndividuel(uniteLegale)) ||
    hasAidesFinancieres(uniteLegale);

  return [
    {
      ficheType: FICHE.INFORMATION,
      label: "Fiche résumé",
      params: { slug: uniteLegale.chemin },
      to: "/entreprise/$slug",
      noFollow: false,
      shouldDisplay: true,
      width: "80px",
    },
    {
      ficheType: FICHE.DIRIGEANTS,
      params: { slug: uniteLegale.siren },
      to: "/dirigeants/$slug",
      noFollow: false,
      shouldDisplay: true,
      ...(isCollectiviteTerritoriale(uniteLegale)
        ? { label: "Élus & organigramme", width: "120px" }
        : isServicePublic(uniteLegale)
          ? { label: "Responsables & organigramme", width: "130px" }
          : hasRights({ user }, ApplicationRights.liensCapitalistiques)
            ? { label: "Dirigeants & actionnariat", width: "120px" }
            : { label: "Dirigeants" }),
    },
    {
      ficheType: FICHE.DOCUMENTS,
      label: "Documents",
      params: { slug: uniteLegale.siren },
      to: "/documents/$slug",
      noFollow: false,
      shouldDisplay: true,
      width: "95px",
    },
    {
      ficheType: FICHE.FINANCES,
      label: "Données financières",
      params: { slug: uniteLegale.siren },
      to: "/donnees-financieres/$slug",
      noFollow: false,
      shouldDisplay: shouldDisplayFinances,
      width: "100px",
    },
    {
      ficheType: FICHE.ANNONCES,
      params: { slug: uniteLegale.siren },
      to: "/annonces/$slug",
      label: `Annonces${
        uniteLegale.dateMiseAJourInpi ? " et observations" : ""
      }`,
      noFollow: false,
      shouldDisplay: true,
      width: uniteLegale.dateMiseAJourInpi ? "130px" : "90px",
    },
    {
      ficheType: FICHE.CERTIFICATS,
      params: { slug: uniteLegale.siren },
      to: "/labels-certificats/$slug",
      label: `${
        checkHasQuality(uniteLegale) ? "Qualités, l" : "L"
      }abels et certificats`,
      noFollow: false,
      shouldDisplay:
        checkHasLabelsAndCertificates(uniteLegale) ||
        hasRights({ user }, ApplicationRights.protectedCertificats),
      width: checkHasQuality(uniteLegale) ? "200px" : "110px",
    },
    {
      ficheType: FICHE.ETABLISSEMENTS_SCOLAIRES,
      params: { slug: uniteLegale.siren },
      to: "/etablissements-scolaires/$slug",
      label: "Établissements scolaires",
      noFollow: false,
      shouldDisplay: uniteLegale.complements.estUai,
    },
    {
      ficheType: FICHE.DIVERS,
      params: { slug: uniteLegale.siren },
      to: "/divers/$slug",
      label: "Conventions collectives",
      noFollow: false,
      shouldDisplay: (uniteLegale.listeIdcc || []).length > 0,
      width: "130px",
    },
  ];
};

export const Tabs: React.FC<{
  currentFicheType: FICHE;
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}> = ({ currentFicheType, uniteLegale, user }) => {
  const tabs = getUniteLegaleTabs(uniteLegale, user);
  return (
    <PrintNever>
      <div className={styles.titleTabs}>
        {tabs
          .filter(({ shouldDisplay }) => shouldDisplay)
          .map(({ to, params, ficheType, label, noFollow, width = "auto" }) => (
            <TabLink
              active={currentFicheType === ficheType}
              key={label}
              label={label}
              noFollow={noFollow}
              params={params}
              to={to}
              width={width}
            />
          ))}
      </div>
    </PrintNever>
  );
};

export const TabsForEtablissement: React.FC<{
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}> = ({ uniteLegale, user }) => {
  const tabs = getUniteLegaleTabs(uniteLegale, user);
  return (
    <ul className={styles.titleTabsEtablissement}>
      {tabs
        .filter(({ shouldDisplay }) => shouldDisplay)
        .map(({ to, params, label, noFollow }) => (
          <li key={label}>
            <Link params={params} rel={noFollow ? "nofollow" : ""} to={to}>
              <h2>{label}</h2>
            </Link>
          </li>
        ))}
    </ul>
  );
};
