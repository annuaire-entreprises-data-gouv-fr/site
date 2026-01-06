import type React from "react";
import { Link } from "#components/Link";
import { SaveFavourite } from "#components/save-favourite";
import { CopyPaste } from "#components/table/copy-paste";
import UniteLegaleBadge from "#components/unite-legale-badge";
import { UniteLegaleDescription } from "#components/unite-legale-description";
import { UniteLegaleEtablissementCountDescription } from "#components/unite-legale-description/etablissement-count-description";
import SocialMedia from "#components-ui/social-media";
import IsActiveTag from "#components-ui/tag/is-active-tag";
import { NonDiffusibleTag } from "#components-ui/tag/non-diffusible-tag";
import type { ISession } from "#models/authentication/user/session";
import { estNonDiffusibleStrict } from "#models/core/diffusion";
import type { IUniteLegale } from "#models/core/types";
import { formatIntFr } from "#utils/helpers";
import TitleAlerts from "./alerts";
import styles from "./styles.module.css";
import { FICHE, Tabs } from "./tabs";

type IProps = {
  ficheType?: FICHE;
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

const Title: React.FC<IProps> = ({
  ficheType = FICHE.INFORMATION,
  uniteLegale,
  session,
}) => (
  <div className={styles.headerSection}>
    <div>
      <TitleAlerts
        session={session}
        statutDiffusion={uniteLegale.statutDiffusion}
        uniteLegale={uniteLegale}
      />
      <SaveFavourite
        name={uniteLegale.nomComplet}
        path={`/entreprise/${uniteLegale.chemin}`}
        siren={uniteLegale.siren}
      />
      <h1>
        <Link href={`/entreprise/${uniteLegale.chemin}`}>
          {uniteLegale.nomComplet}
        </Link>
      </h1>
      <div className={styles.subTitle}>
        <UniteLegaleBadge uniteLegale={uniteLegale} />
        <span className={styles.sirenTitle}>
          &nbsp;‣&nbsp;
          <span style={{ display: "inline-flex" }}>
            <CopyPaste
              disableCopyIcon={true}
              label="SIREN"
              shouldRemoveSpace={true}
            >
              {formatIntFr(uniteLegale.siren)}
            </CopyPaste>
          </span>
        </span>
        <span>
          <NonDiffusibleTag etablissementOrUniteLegale={uniteLegale} />
          <IsActiveTag
            etatAdministratif={uniteLegale.etatAdministratif}
            statutDiffusion={uniteLegale.statutDiffusion}
          />
        </span>
      </div>
      {uniteLegale.etablissements.all && (
        <div className={styles.subSubTitle}>
          <UniteLegaleEtablissementCountDescription uniteLegale={uniteLegale} />
        </div>
      )}
    </div>
    <SocialMedia
      label={uniteLegale.nomComplet}
      path={`https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.chemin}`}
      siren={uniteLegale.siren}
    />
    {estNonDiffusibleStrict(uniteLegale) ? (
      <p>Les informations concernant cette entreprise ne sont pas publiques.</p>
    ) : (
      <UniteLegaleDescription uniteLegale={uniteLegale} />
    )}

    <Tabs
      currentFicheType={ficheType}
      session={session}
      uniteLegale={uniteLegale}
    />
  </div>
);

export default Title;
