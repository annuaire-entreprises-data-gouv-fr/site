import { useLocation } from "@tanstack/react-router";
import { PrintNever } from "#/components-ui/print-visibility";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { IFondation } from "#/models/core/fondations.types";
import type { IUniteLegale } from "#/models/core/types";
import { FICHE, getUniteLegaleTabs, type ITab } from "../title-section/tabs";
import styles from "../title-section/tabs/styles.module.css";
import TabLink from "../title-section/tabs/tab-link";

export function TabsFondation({
  fondation,
  uniteLegale,
  user,
}: {
  fondation: IFondation;
  uniteLegale: IUniteLegale | null;
  user: IAgentInfo | null;
}) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const params = { slug: fondation.id };
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
  const tabs: Omit<ITab, "ficheType">[] = fondationTabs.map((tab) => ({
    ...tab,
    params,
    noFollow: false,
    shouldDisplay: true,
  }));

  if (uniteLegale) {
    tabs.push(
      ...getUniteLegaleTabs(uniteLegale, user).filter(
        ({ ficheType }) =>
          ficheType !== FICHE.INFORMATION &&
          ficheType !== FICHE.DIRIGEANTS &&
          ficheType !== FICHE.DOCUMENTS &&
          ficheType !== FICHE.FINANCES
      )
    );
  }

  return (
    <PrintNever>
      <div className={styles.titleTabs}>
        {tabs
          .filter(({ shouldDisplay }) => shouldDisplay)
          .map(({ to, params: tabParams, label, noFollow, width = "auto" }) => (
            <TabLink
              active={
                pathname.replace(/\/$/, "") ===
                to?.replace("$slug", fondation.id)
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
