import { OpenClosedTag } from '#components-ui/badge/frequent';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import AvisSituationLink from '#components/justificatifs/avis-situation-link';
import ExtraitRNELink from '#components/justificatifs/extrait-rne-link';
import { estActif } from '#models/core/etat-administratif';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { formatDate } from '#utils/helpers';
import React, { PropsWithChildren } from 'react';
import styles from './style.module.css';

const Wrapper: React.FC<PropsWithChildren<{ link: JSX.Element }>> = ({
  children,
  link,
}) => (
  <div className={styles['inscriptions-wrapper']}>
    <div>{children}</div>
    <div className="layout-right">{link}</div>
  </div>
);

export const UniteLegaleInscriptionSirene = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => (
  <Wrapper
    link={
      <Icon slug="download">
        <AvisSituationLink
          session={session}
          etablissement={uniteLegale.siege}
          label="Avis de situation Sirene"
        />
      </Icon>
    }
  >
    <InformationTooltip
      tabIndex={undefined}
      label={`Cette structure est inscrite dans la base Sirene tenue par l’Insee${
        uniteLegale.dateCreation
          ? `, depuis le ${formatDate(uniteLegale.dateCreation)}`
          : ''
      }. Elle a été mise à jour le ${formatDate(
        uniteLegale.dateMiseAJourInsee
      )}.`}
    >
      {estActif(uniteLegale) ? (
        <OpenClosedTag isVerified={true} label="Inscrite (Insee)">
          {uniteLegale.dateCreation && (
            <>le {formatDate(uniteLegale.dateCreation)}</>
          )}
        </OpenClosedTag>
      ) : (
        <OpenClosedTag isVerified={false} label="Cessée (Insee)">
          {uniteLegale.dateCreation && (
            <>le {formatDate(uniteLegale.dateFermeture)}</>
          )}
        </OpenClosedTag>
      )}
    </InformationTooltip>
  </Wrapper>
);

export const UniteLegaleInscriptionRNE = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => (
  <Wrapper
    link={
      <Icon slug="download">
        <ExtraitRNELink
          uniteLegale={uniteLegale}
          session={session}
          label="Extrait RNE"
        />{' '}
        (<a href="/faq/extrait-kbis">équivalent KBIS/D1</a>)
      </Icon>
    }
  >
    <InformationTooltip
      tabIndex={undefined}
      label={`Cette structure est immatriculée au Registre National des Entreprises (RNE)${
        uniteLegale.immatriculation?.dateImmatriculation
          ? `, depuis le ${formatDate(
              uniteLegale.immatriculation?.dateImmatriculation
            )}`
          : ''
      }. Elle a été mise à jour le ${formatDate(
        uniteLegale.dateMiseAJourInpi
      )}.`}
    >
      <a href="#immatriculation-rne">
        {uniteLegale.immatriculation?.dateRadiation ? (
          <OpenClosedTag isVerified={true} label="Radiée au RNE(INPI)">
            le {formatDate(uniteLegale.immatriculation?.dateRadiation)}
          </OpenClosedTag>
        ) : (
          <OpenClosedTag isVerified={true} label="Immatriculée au RNE (INPI)">
            {uniteLegale.immatriculation?.dateImmatriculation && (
              <>
                le{' '}
                {formatDate(uniteLegale.immatriculation?.dateImmatriculation)}
              </>
            )}
          </OpenClosedTag>
        )}
      </a>
    </InformationTooltip>
  </Wrapper>
);

export const UniteLegaleInscriptionRNA = ({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) => (
  <Wrapper
    link={
      <Icon slug="download">
        <a>Annonce de création au JOAFE</a>
      </Icon>
    }
  >
    <InformationTooltip
      tabIndex={undefined}
      label="Cette structure est inscrite au Registre National des Association (RNA)."
    >
      <a href="#association-section">
        <OpenClosedTag
          isVerified={true}
          label={'Inscrite au RNA (Ministère de l’Intérieur)'}
        >
          le {formatDate(uniteLegale.immatriculation?.dateImmatriculation)}
        </OpenClosedTag>
      </a>
    </InformationTooltip>
  </Wrapper>
);
