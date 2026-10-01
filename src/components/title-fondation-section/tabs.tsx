import { useLocation } from "@tanstack/react-router";
import { PrintNever } from "#/components-ui/print-visibility";
import { useAuth } from "#/contexts/auth.context";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { IUniteLegale } from "#/models/core/types";
import { FICHE, getUniteLegaleTabs, type ITab } from "../title-section/tabs";
import styles from "../title-section/tabs/styles.module.css";
import TabLink from "../title-section/tabs/tab-link";

export const FONDATIONS_HANDLED_TABS: FICHE[] = [
  FICHE.INFORMATION,
  FICHE.DIRIGEANTS,
  FICHE.DOCUMENTS,
  FICHE.FINANCES,
];
const fondationTabs: Pick<ITab, "label" | "to" | "width">[] = [
  { label: "Fiche résumé", to: "/fondation/$slug", width: "80px" },
  { label: "Dirigeants", to: "/fondation/$slug/dirigeants" },
  { label: "Liens", to: "/fondation/$slug/liens" },
  { label: "Documents", to: "/fondation/$slug/documents", width: "95px" },
  {
    label: "Données financières",
    to: "/fondation/$slug/donnees-financieres",
    width: "100px",
  },
];

export const getFondationTabs = (
  fondationRNF: string,
  uniteLegale: IUniteLegale | null,
  user: IAgentInfo | null
): Omit<ITab, "ficheType">[] => {
  const tabs: Omit<ITab, "ficheType">[] = fondationTabs.map((tab) => ({
    ...tab,
    params: { slug: fondationRNF },
    noFollow: false,
    shouldDisplay: true,
  }));

  if (uniteLegale) {
    tabs.push(
      ...getUniteLegaleTabs(uniteLegale, user).filter(
        ({ ficheType }) => !FONDATIONS_HANDLED_TABS.includes(ficheType)
      )
    );
  }

  return tabs;
};

export function TabsFondation({
  fondationRNF,
  uniteLegale,
}: {
  fondationRNF: string;
  uniteLegale: IUniteLegale | null;
}) {
  const { user } = useAuth();
  const pathname = useLocation({ select: (location) => location.pathname });

  const tabs = getFondationTabs(fondationRNF, uniteLegale, user);

  return (
    <PrintNever>
      <div className={styles.titleTabs}>
        {tabs
          .filter(({ shouldDisplay }) => shouldDisplay)
          .map(({ to, params: tabParams, label, noFollow, width = "auto" }) => (
            <TabLink
              active={
                pathname.replace(/\/$/, "") ===
                to?.replace("$slug", fondationRNF)
              }
              key={label}
              label={label}
              noFollow={noFollow}
              params={tabParams}
              search={(search) => ({ from: search.from })}
              to={to}
              width={width}
            />
          ))}
      </div>
    </PrintNever>
  );
}
