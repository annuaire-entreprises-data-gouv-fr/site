import React from 'react';
import { Warning } from '#components-ui/alerts';
import IsActiveTag from '#components-ui/is-active-tag';
import SocialMedia from '#components-ui/social-media';
import { Tag } from '#components-ui/tag';
import { EtablissementDescription } from '#components/etablissement-description';
import { estDiffusible, estNonDiffusibleStrict } from '#models/core/diffusion';
import { IEtablissement, IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import {
  formatIntFr,
  formatSiret,
  uniteLegaleLabelWithPronounContracted,
} from '#utils/helpers';
import { INSEE } from '../../administrations';
import TitleAlerts from '../alerts';
import { FICHE, Tabs } from '../tabs';
import styles from './styles.module.css';

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
          <INSEE /> : {formatSiret(etablissement.oldSiret)} et{' '}
          {formatSiret(etablissement.siret)}. Pour voir les informations
          complètes, consultez la page{' '}
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
      Établissement{' '}
      {etablissement.enseigne ||
        etablissement.denomination ||
        uniteLegale.nomComplet}{' '}
      {etablissement.commune && (
        <>
          à{' '}
          <a href={`/carte/${etablissement.siret}`}>{etablissement.commune}</a>
        </>
      )}
    </h1>

    <div className={styles.subTitle}>
      <span className={styles.sirenOrSiret}>
        {formatSiret(etablissement.siret)}
      </span>
      {!estDiffusible(etablissement) && <Tag color="new">non-diffusible</Tag>}
      <IsActiveTag
        etatAdministratif={etablissement.etatAdministratif}
        statutDiffusion={etablissement.statutDiffusion}
        since={etablissement.dateFermeture}
      />
    </div>
    <div className={styles.subSubTitle}>
      <span>Cet établissement est </span>
      {etablissement.estSiege ? (
        <>
          le{' '}
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
      <span>
        {' '}
        {uniteLegaleLabelWithPronounContracted(uniteLegale)}{' '}
        <a href={`/entreprise/${uniteLegale.siren}`}>
          {uniteLegale.nomComplet}&nbsp;‣&nbsp;
          <span className={styles.sirenOrSiret}>
            {formatIntFr(uniteLegale.siren)}
          </span>
        </a>
        <IsActiveTag
          etatAdministratif={uniteLegale.etatAdministratif}
          statutDiffusion={uniteLegale.statutDiffusion}
          size="small"
        />
      </span>
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
        session={session}
      />
    )}

    <Tabs
      uniteLegale={uniteLegale}
      currentFicheType={FICHE.ETABLISSEMENT}
      session={session}
    />
  </div>
);

export { TitleEtablissementWithDenomination };
