import { OpenClosedTag } from '#components-ui/badge/frequent';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import AvisSituationLink from '#components/justificatifs/avis-situation-link';
import ExtraitRNELink from '#components/justificatifs/extrait-rne-link';
import { estActif } from '#models/core/etat-administratif';
import {
  IUniteLegale,
  isAssociation,
  isServicePublic,
} from '#models/core/types';
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
}) => {
  if (!uniteLegale.dateMiseAJourInsee) {
    return null;
  }

  return (
    <Wrapper
      link={
        <AvisSituationLink
          session={session}
          etablissement={uniteLegale.siege}
          label="Avis de situation"
          button={true}
        />
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
          <OpenClosedTag icon="open" label="Inscrite (Insee)">
            {uniteLegale.dateCreation && (
              <>le {formatDate(uniteLegale.dateCreation)}</>
            )}
          </OpenClosedTag>
        ) : (
          <OpenClosedTag icon="closed" label="Cessée (Insee)">
            {uniteLegale.dateCreation && (
              <>le {formatDate(uniteLegale.dateFermeture)}</>
            )}
          </OpenClosedTag>
        )}
      </InformationTooltip>
    </Wrapper>
  );
};

export const UniteLegaleInscriptionRNE = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => {
  if (!uniteLegale.dateMiseAJourInpi) {
    if (isServicePublic(uniteLegale) || isAssociation(uniteLegale)) {
      return null;
    } else {
      return (
        <Wrapper
          link={
            <Icon slug="searchLine">
              <a
                rel="noreferre noopener"
                target="_blank"
                href="https://data.inpi.fr"
              >
                Rechercher sur data.inpi.fr
              </a>
            </Icon>
          }
        >
          <InformationTooltip
            tabIndex={undefined}
            label={
              'Cette structure est n’a pas été retrouvée sur le téléservice du Registre National des Entreprises (RNE) tenu par l’INPI. Pourtant, vu sa forme juridique, elle devrait y être inscrite. Vous pouvez essayer de la retrouver sur le site data.inpi.fr'
            }
          >
            <OpenClosedTag
              icon="questionFill"
              label="Non trouvée dans le RNE (INPI)"
            />
          </InformationTooltip>
        </Wrapper>
      );
    }
  }

  return (
    <Wrapper
      link={
        <ExtraitRNELink
          uniteLegale={uniteLegale}
          session={session}
          label="Extrait RNE"
        />
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
        }.${
          uniteLegale.dateMiseAJourInpi
            ? ` Elle a été mise à jour le ${formatDate(
                uniteLegale.dateMiseAJourInpi
              )}.`
            : ''
        }`}
      >
        <a href="#immatriculation-rne">
          {uniteLegale.immatriculation?.dateRadiation ? (
            <OpenClosedTag icon="closed" label="Radiée au RNE (INPI)">
              le {formatDate(uniteLegale.immatriculation?.dateRadiation)}
            </OpenClosedTag>
          ) : (
            <OpenClosedTag icon="open" label="Immatriculée au RNE (INPI)">
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
};

export const UniteLegaleInscriptionRNA = ({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) => {
  if (!uniteLegale.association.idAssociation) {
    return null;
  }
  return (
    <Wrapper
      link={
        <Icon slug="download">
          <a href={`/documents/${uniteLegale.siren}`}>
            Annonce de création au JOAFE
          </a>
        </Icon>
      }
    >
      <InformationTooltip
        tabIndex={undefined}
        label="Cette structure est inscrite au Registre National des Associations (RNA)."
      >
        <a href="#association-section">
          <OpenClosedTag
            icon="open"
            label={'Inscrite au RNA (Ministère de l’Intérieur)'}
          />
        </a>
      </InformationTooltip>
    </Wrapper>
  );
};
