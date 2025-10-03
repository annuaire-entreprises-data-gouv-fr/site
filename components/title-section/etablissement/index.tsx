import { Warning } from "#components-ui/alerts";
import { SimpleSeparator } from "#components-ui/horizontal-separator";
import { PrintNever } from "#components-ui/print-visibility";
import SocialMedia from "#components-ui/social-media";
import { Tag } from "#components-ui/tag";
import IsActiveTag from "#components-ui/tag/is-active-tag";
import { NonDiffusibleTag } from "#components-ui/tag/non-diffusible-tag";
import { EtablissementDescription } from "#components/etablissement-description";
import MapEtablissement from "#components/map/map-etablissement";
import { CopyPaste } from "#components/table/copy-paste";
import UniteLegaleBadge from "#components/unite-legale-badge";
import type { ISession } from "#models/authentication/user/session";
import { estDiffusible, estNonDiffusibleStrict } from "#models/core/diffusion";
import type { IEtablissement, IUniteLegale } from "#models/core/types";
import { formatIntFr, formatSiret } from "#utils/helpers";
import type React from "react";
import { INSEE } from "../../administrations";
import TitleAlerts from "../alerts";
import { TabsForEtablissement } from "../tabs";
import styles from "./styles.module.css";

const TitleEtablissementWithDenomination: React.FC<{
  uniteLegale: IUniteLegale;
  etablissement: IEtablissement;
  session: ISession | null;
}> = ({ uniteLegale, etablissement, session }) => (
  <div className={styles.etablissementTitle}>
    {etablissement.oldSiret &&
      etablissement.oldSiret !== etablissement.siret && (
        <Warning full>
          Cet établissement est inscrit en double à l’
          <INSEE /> : {formatSiret(etablissement.oldSiret)} et{" "}
          {formatSiret(etablissement.siret)}. Pour voir les informations
          complètes, consultez la page{" "}
          <a href={`/etablissement/${etablissement.siret}`}>
            {formatSiret(etablissement.siret)}
          </a>
          .
        </Warning>
      )}

    <TitleAlerts
      uniteLegale={uniteLegale}
      session={session}
      statutDiffusion={etablissement.statutDiffusion}
    />

    <h1>
      Établissement{" "}
      {etablissement.enseigne ||
        etablissement.denomination ||
        uniteLegale.nomComplet}{" "}
      {etablissement.commune && (
        <>
          à{" "}
          <a href={`/etablissement/${etablissement.siret}`}>
            {etablissement.commune}
          </a>
        </>
      )}
    </h1>
    <div className={styles.titleBlock}>
      <div className={styles.titleBlockContent}>
        <div className={styles.subTitle}>
          <span className={styles.sirenOrSiret}>
            <CopyPaste
              shouldRemoveSpace={true}
              disableCopyIcon={true}
              label="SIRET"
            >
              {formatSiret(etablissement.siret)}
            </CopyPaste>
          </span>
          <NonDiffusibleTag etablissementOrUniteLegale={etablissement} />
          <IsActiveTag
            etatAdministratif={etablissement.etatAdministratif}
            statutDiffusion={etablissement.statutDiffusion}
            since={etablissement.dateFermeture}
          />
        </div>
        <div className={styles.subSubTitle}>
          <div>
            <div>
              <span>Cet établissement est </span>
              {etablissement.estSiege ? (
                <>
                  le{" "}
                  <Tag color="info" size="small">
                    siège social
                  </Tag>
                </>
              ) : etablissement.ancienSiege ? (
                <>
                  un<Tag size="small">ancien siège social</Tag>
                </>
              ) : (
                <Tag size="small">un établissement secondaire</Tag>
              )}
              <span> de :</span>
            </div>
            <div>
              <div>
                <strong>
                  <a href={`/entreprise/${uniteLegale.chemin}`}>
                    {uniteLegale.nomComplet}
                  </a>
                </strong>
              </div>
              <UniteLegaleBadge uniteLegale={uniteLegale} />
              <span className={styles.sirenTitle}>
                &nbsp;‣&nbsp;
                <span style={{ display: "inline-flex" }}>
                  <CopyPaste
                    shouldRemoveSpace={true}
                    disableCopyIcon={true}
                    label="SIREN"
                  >
                    {formatIntFr(uniteLegale.siren)}
                  </CopyPaste>
                </span>
              </span>
              <IsActiveTag
                etatAdministratif={uniteLegale.etatAdministratif}
                statutDiffusion={uniteLegale.statutDiffusion}
                size="small"
              />
              <PrintNever>
                <SimpleSeparator />

                <TabsForEtablissement
                  uniteLegale={uniteLegale}
                  session={session}
                />
              </PrintNever>
            </div>
          </div>
        </div>
      </div>

      {estDiffusible(etablissement) && (
        <div>
          <MapEtablissement etablissement={etablissement} />
        </div>
      )}
    </div>
    <br />
    <SocialMedia
      path={`https://annuaire-entreprises.data.gouv.fr/etablissement/${etablissement.siret}`}
      label={
        etablissement.enseigne ||
        etablissement.denomination ||
        uniteLegale.nomComplet
      }
    />
    {estNonDiffusibleStrict(etablissement) ? (
      <p>Les informations concernant cette entreprise ne sont pas publiques.</p>
    ) : (
      <EtablissementDescription
        etablissement={etablissement}
        uniteLegale={uniteLegale}
      />
    )}
  </div>
);

export { TitleEtablissementWithDenomination };
