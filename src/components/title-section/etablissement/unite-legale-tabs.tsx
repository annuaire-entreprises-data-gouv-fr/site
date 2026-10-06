import { Link } from "#/components/link";
import { getFondationTabs } from "#/components/title-fondation-section/tabs";
import { useFeatureFlag } from "#/hooks/use-feature-flag";
import type { IAgentInfo } from "#/models/authentication/agent";
import { type IUniteLegale, isFondation } from "#/models/core/types";
import { getUniteLegaleTabs } from "../tabs";
import styles from "../tabs/styles.module.css";

export const TabsForEtablissement: React.FC<{
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}> = ({ uniteLegale, user }) => {
  const isFondationsEnabled = useFeatureFlag("fondations_enabled");
  const isCollectiviteTerritorialeEnabled = useFeatureFlag(
    "collectivite_territoriale_enabled"
  );

  const tabs =
    isFondation(uniteLegale) && isFondationsEnabled.isEnabled
      ? getFondationTabs(uniteLegale.complements.numeroRnf, uniteLegale, user)
      : getUniteLegaleTabs(uniteLegale, user, {
          hideCollectiviteTab:
            isCollectiviteTerritorialeEnabled.isLoading ||
            !isCollectiviteTerritorialeEnabled.isEnabled,
        });
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
