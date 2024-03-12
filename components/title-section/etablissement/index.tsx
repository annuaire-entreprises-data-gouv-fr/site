import React from 'react';
import { Warning } from '#components-ui/alerts';
import IsActiveTag from '#components-ui/is-active-tag';
import SocialMedia from '#components-ui/social-media';
import { Tag } from '#components-ui/tag';
import { EtablissementDescription } from '#components/etablissement-description';
import {
  estNonDiffusible,
  getEtablissementName,
  getNomComplet,
} from '#models/core/statut-diffusion';
import { IEtablissement, IUniteLegale } from '#models/core/types';
import {
  formatIntFr,
  formatSiret,
  uniteLegaleLabelWithPronounContracted,
} from '#utils/helpers';
import { ISession } from '#utils/session';
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
      Établissement {getEtablissementName(etablissement, uniteLegale, session)}{' '}
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
      {estNonDiffusible(etablissement) && <Tag color="new">non-diffusible</Tag>}
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
      ) : uniteLegale.allSiegesSiret.indexOf(etablissement.siret) > -1 &&
        !etablissement.estSiege ? (
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
          {getNomComplet(uniteLegale, session)}&nbsp;‣&nbsp;
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
      label={getEtablissementName(etablissement, uniteLegale, session)}
    />

    {estNonDiffusible(etablissement) ? (
      <p>Les informations concernant cette entreprise ne sont pas publiques.</p>
    ) : (
      <EtablissementDescription
        etablissement={etablissement}
        uniteLegale={uniteLegale}
        session={session}
      />
    )}

    <Tabs uniteLegale={uniteLegale} currentFicheType={FICHE.ETABLISSEMENT} />
  </div>
);

export { TitleEtablissementWithDenomination };
