import React from 'react';
import IsActiveTag from '#components-ui/is-active-tag';
import SocialMedia from '#components-ui/social-media';
import { Tag } from '#components-ui/tag';
import { SaveFavourite } from '#components/save-favourite';
import UniteLegaleBadge from '#components/unite-legale-badge';
import { UniteLegaleDescription } from '#components/unite-legale-description';
import { UniteLegaleEtablissementCountDescription } from '#components/unite-legale-description/etablissement-count-description';
import {
  estDiffusible,
  estNonDiffusible,
  getNomComplet,
} from '#models/core/statut-diffusion';
import { IUniteLegale } from '#models/core/types';
import { formatIntFr } from '#utils/helpers';
import { ISession } from '#utils/session';
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
        name={getNomComplet(uniteLegale, session)}
        path={`/entreprise/${uniteLegale.chemin}`}
      />
      <h1>
        <a href={`/entreprise/${uniteLegale.chemin}`}>
          {getNomComplet(uniteLegale, session)}
        </a>
      </h1>
      <div className={styles.subTitle}>
        <UniteLegaleBadge uniteLegale={uniteLegale} />
        <span className={styles.sirenTitle}>
          &nbsp;‣&nbsp;{formatIntFr(uniteLegale.siren)}
        </span>
        <span>
          {!estDiffusible(uniteLegale) && <Tag color="new">non-diffusible</Tag>}
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
      label={getNomComplet(uniteLegale, session)}
      siren={uniteLegale.siren}
    />
    {estNonDiffusible(uniteLegale) ? (
      <p>Les informations concernant cette entreprise ne sont pas publiques.</p>
    ) : (
      <UniteLegaleDescription uniteLegale={uniteLegale} session={session} />
    )}

    <Tabs uniteLegale={uniteLegale} currentFicheType={ficheType} />
  </div>
);

export default Title;
