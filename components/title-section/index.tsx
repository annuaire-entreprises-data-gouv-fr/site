import MultipleSirenAlert from '#components-ui/alerts/multiple-siren';
import NonDiffusibleAlert from '#components-ui/alerts/non-diffusible';
import ProtectedData from '#components-ui/alerts/protected-data';
import { Icon } from '#components-ui/icon/wrapper';
import IsActiveTag from '#components-ui/is-active-tag';
import { PrintNever } from '#components-ui/print-visibility';
import SocialMedia from '#components-ui/social-media';
import { Tag } from '#components-ui/tag';
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
import { ISession, isAgent } from '#utils/session';
import React from 'react';
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
    <div className="title">
      {isAgent(session) && (
        <PrintNever>
          <ProtectedData full>
            Vous êtes connecté avec un compte <strong>agent public</strong>. Ce
            compte vous donne accès à certaines données exclusivement réservées
            à l’administration, identifiables par la mention “
            <Icon size={12} slug="lockFill">
              Réservé aux agents publics
            </Icon>
            ” .
            <br />
            <br />
            Ce service est en <Tag color="new">beta test</Tag>. Il est possible
            que vous recontriez des bugs ou des erreurs. Si cela arrive,{' '}
            <a href="mailto:charlotte.choplin@beta.gouv.fr">
              n’hésitez pas à nous contacter
            </a>
            .
          </ProtectedData>
        </PrintNever>
      )}
      {!estDiffusible(uniteLegale) && (
        <>
          {isAgent(session) ? (
            <ProtectedData full>
              Cette structure est non-diffusible mais vous pouvez voir ses
              informations grâce à votre compte <strong>agent-public</strong>.
            </ProtectedData>
          ) : (
            <NonDiffusibleAlert />
          )}
        </>
      )}
      <MultipleSirenAlert uniteLegale={uniteLegale} />
      <h1>
        <a href={`/entreprise/${uniteLegale.chemin}`}>
          {getNomComplet(uniteLegale, session)}
        </a>
      </h1>
      <div className="unite-legale-sub-title">
        <UniteLegaleBadge uniteLegale={uniteLegale} />
        <span className="siren">
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
        <div className="unite-legale-sub-sub-title">
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

    <Tabs
      uniteLegale={uniteLegale}
      currentFicheType={ficheType}
      session={session}
    />
  </div>
);

export default Title;
