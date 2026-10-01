import { Link } from "#/components/link";
import { FondationBadge } from "#/components-ui/badge/frequent";
import SocialMedia from "#/components-ui/social-media";
import type { IUniteLegale } from "#/models/core/types";
import { CopyPaste } from "../table/copy-paste";
import styles from "../title-section/styles.module.css";
import { UniteLegaleEtablissementCountDescription } from "../unite-legale-description/etablissement-count-description";
import { TabsFondation } from "./tabs";

interface IProps {
  fondationName: string;
  fondationRNF: string;
  uniteLegale: IUniteLegale | null;
}

export function TitleFondation(props: IProps) {
  const { fondationName, fondationRNF, uniteLegale } = props;
  return (
    <div className={styles.headerSection}>
      <h1>
        <Link
          params={{ slug: fondationRNF }}
          search={(params) => ({ from: params.from })}
          to="/fondation/$slug"
        >
          {fondationName}
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
              {fondationRNF}
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
        id={fondationRNF}
        label={fondationName}
        path={`https://annuaire-entreprises.data.gouv.fr/fondation/${fondationRNF}`}
      />
      <TabsFondation fondationRNF={fondationRNF} uniteLegale={uniteLegale} />
    </div>
  );
}
