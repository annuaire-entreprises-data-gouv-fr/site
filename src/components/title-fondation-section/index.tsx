import { Link } from "#/components/link";
import { FondationBadge } from "#/components-ui/badge/frequent";
import SocialMedia from "#/components-ui/social-media";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { IFondation } from "#/models/core/fondations.types";
import type { IUniteLegale } from "#/models/core/types";
import { CopyPaste } from "../table/copy-paste";
import styles from "../title-section/styles.module.css";
import { UniteLegaleEtablissementCountDescription } from "../unite-legale-description/etablissement-count-description";
import { TabsFondation } from "./tabs";

interface IProps {
  fondation: IFondation;
  uniteLegale: IUniteLegale | null;
  user: IAgentInfo | null;
}

export function TitleFondation(props: IProps) {
  const { fondation, uniteLegale, user } = props;
  return (
    <div className={styles.headerSection}>
      <h1>
        <Link
          params={{ slug: fondation.id }}
          search={(params) => ({ from: params.from })}
          to="/fondation/$slug"
        >
          {fondation.title}
        </Link>
      </h1>
      <div className={styles.subTitle}>
        <FondationBadge />
        <span className={styles.sirenTitle}>
          &nbsp;‣&nbsp;
          <span style={{ display: "inline-flex" }}>
            <CopyPaste
              disableCopyIcon={true}
              label="ID RNF"
              shouldRemoveSpace={true}
            >
              {fondation.id}
            </CopyPaste>
          </span>
        </span>
      </div>
      {uniteLegale?.etablissements.all && (
        <div className={styles.subSubTitle}>
          <UniteLegaleEtablissementCountDescription uniteLegale={uniteLegale} />
        </div>
      )}
      <SocialMedia
        id={fondation.id}
        label={fondation.title}
        path={`https://annuaire-entreprises.data.gouv.fr/fondation/${fondation.id}`}
      />
      <TabsFondation
        fondation={fondation}
        uniteLegale={uniteLegale}
        user={user}
      />
    </div>
  );
}
