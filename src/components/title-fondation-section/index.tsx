import clsx from "clsx";
import { Link } from "#/components/link";
import { FondationBadge } from "#/components-ui/badge/frequent";
import { Icon } from "#/components-ui/icon/wrapper";
import SocialMedia from "#/components-ui/social-media";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { IFondation } from "#/models/core/fondations.types";
import type { IUniteLegale } from "#/models/core/types";
import { CopyPaste } from "../table/copy-paste";
import styles from "../title-section/styles.module.css";
import { FICHE, Tabs } from "../title-section/tabs";
import { UniteLegaleEtablissementCountDescription } from "../unite-legale-description/etablissement-count-description";

interface IProps {
  fondation: IFondation;
  uniteLegale: IUniteLegale | null;
  user: IAgentInfo | null;
}

export function TitleFondation(props: IProps) {
  const { fondation, uniteLegale, user } = props;
  return (
    <div className={styles.headerSection}>
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className={clsx(styles.titleContainer, "fr-col-12 fr-col-md-8")}>
          <h1>
            <Link params={{ slug: fondation.id }} to="/fondation/$slug">
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
              <UniteLegaleEtablissementCountDescription
                uniteLegale={uniteLegale}
              />
            </div>
          )}
        </div>
        <div
          className={clsx(
            styles.searchFondationContainer,
            "fr-col-12 fr-col-md-4"
          )}
        >
          <Link
            className="fr-btn fr-btn--icon-right fr-btn--secondary"
            params={{ slug: "fondations" }}
            to="/lp/$slug"
          >
            Rechercher une fondation
            <Icon className="fr-ml-1w" slug="searchLine" />
          </Link>
        </div>
      </div>
      <SocialMedia
        id={fondation.id}
        label={fondation.title}
        path={`https://annuaire-entreprises.data.gouv.fr/fondation/${fondation.id}`}
      />
      {uniteLegale && (
        <Tabs
          currentFicheType={FICHE.INFORMATION}
          uniteLegale={uniteLegale}
          user={user}
        />
      )}
    </div>
  );
}
