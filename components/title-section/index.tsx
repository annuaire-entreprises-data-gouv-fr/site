import SocialMedia from '#components-ui/social-media';
import IsActiveTag from '#components-ui/tag/is-active-tag';
import { NonDiffusibleTag } from '#components-ui/tag/non-diffusible-tag';
import { SaveFavourite } from '#components/save-favourite';
import { CopyPaste } from '#components/table/copy-paste';
import UniteLegaleBadge from '#components/unite-legale-badge';
import { UniteLegaleDescription } from '#components/unite-legale-description';
import { UniteLegaleEtablissementCountDescription } from '#components/unite-legale-description/etablissement-count-description';
import { ISession } from '#models/authentication/user/session';
import { estNonDiffusibleStrict } from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import { formatIntFr } from '#utils/helpers';
import React from 'react';
import TitleAlerts from './alerts';
import styles from './styles.module.css';
import { FICHE, Tabs } from './tabs';

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
        uniteLegale={uniteLegale}
        session={session}
        statutDiffusion={uniteLegale.statutDiffusion}
      />
      <SaveFavourite
        siren={uniteLegale.siren}
        name={uniteLegale.nomComplet}
        path={`/entreprise/${uniteLegale.chemin}`}
      />
      <h1>
        <a href={`/entreprise/${uniteLegale.chemin}`}>
          {uniteLegale.nomComplet}
        </a>
      </h1>
      <div className={styles.subTitle}>
        <UniteLegaleBadge uniteLegale={uniteLegale} />
        <span className={styles.sirenTitle}>
          &nbsp;‣&nbsp;
          <span style={{ display: 'inline-flex' }}>
            <CopyPaste
              shouldRemoveSpace={true}
              disableTooltip={true}
              label="SIREN"
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
      path={`https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.chemin}`}
      label={uniteLegale.nomComplet}
      siren={uniteLegale.siren}
    />
    {estNonDiffusibleStrict(uniteLegale) ? (
      <p>Les informations concernant cette entreprise ne sont pas publiques.</p>
    ) : (
      <UniteLegaleDescription uniteLegale={uniteLegale} />
    )}

    <Tabs
      uniteLegale={uniteLegale}
      currentFicheType={ficheType}
      session={session}
    />
  </div>
);

export default Title;
