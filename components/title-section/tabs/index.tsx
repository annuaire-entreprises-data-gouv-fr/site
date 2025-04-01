import { PrintNever } from '#components-ui/print-visibility';
import {
  checkHasLabelsAndCertificates,
  checkHasQuality,
} from '#components/badges-section/labels-and-certificates';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import {
  IUniteLegale,
  isCollectiviteTerritoriale,
  isServicePublic,
} from '#models/core/types';
import styles from './styles.module.css';
import TabLink from './tab-link';

export enum FICHE {
  INFORMATION = 'résumé',
  DOCUMENTS = 'documents',
  ACTES = 'actes & statuts',
  ANNONCES = 'annonces',
  FINANCES = 'finances',
  CERTIFICATS = 'Labels ou certifications',
  COMPTES = 'bilans & comptes',
  DIRIGEANTS = 'dirigeants',
  DIVERS = 'conventions collectives',
  ETABLISSEMENTS_SCOLAIRES = 'établissements scolaires',
  ETABLISSEMENT = 'fiche établissement',
}

const getUniteLegaleTabs = (
  uniteLegale: IUniteLegale,
  session: ISession | null
) => {
  const shouldDisplayFinances =
    // hide for public services
    !isServicePublic(uniteLegale) &&
    // hide for EI
    !uniteLegale.complements.estEntrepreneurIndividuel;

  return [
    {
      ficheType: FICHE.INFORMATION,
      label: `Fiche résumé`,
      fullPath: `/entreprise/${uniteLegale.chemin}`,
      noFollow: false,
      shouldDisplay: true,
      width: '80px',
    },
    {
      ficheType: FICHE.DIRIGEANTS,
      label: isCollectiviteTerritoriale(uniteLegale) ? 'Élus' : 'Dirigeants',
      pathPrefix: '/dirigeants/',
      noFollow: false,
      shouldDisplay: true,
    },
    {
      ficheType: FICHE.DOCUMENTS,
      label: 'Documents',
      pathPrefix: '/documents/',
      noFollow: false,
      shouldDisplay: true,
      width: '95px',
    },
    {
      ficheType: FICHE.FINANCES,
      label: 'Données financières',
      pathPrefix: '/donnees-financieres/',
      noFollow: false,
      shouldDisplay: shouldDisplayFinances,
      width: '100px',
    },
    {
      ficheType: FICHE.ANNONCES,
      label: `Annonces${
        uniteLegale.dateMiseAJourInpi ? ' et observations' : ''
      }`,
      pathPrefix: '/annonces/',
      noFollow: false,
      shouldDisplay: true,
      width: uniteLegale.dateMiseAJourInpi ? '130px' : '90px',
    },
    {
      ficheType: FICHE.CERTIFICATS,
      label: `${
        checkHasQuality(uniteLegale) ? 'Qualités, l' : 'L'
      }abels et certificats`,
      pathPrefix: '/labels-certificats/',
      noFollow: false,
      shouldDisplay:
        checkHasLabelsAndCertificates(uniteLegale) ||
        hasRights(session, ApplicationRights.protectedCertificats),
      width: checkHasQuality(uniteLegale) ? '200px' : '110px',
    },
    {
      ficheType: FICHE.ETABLISSEMENTS_SCOLAIRES,
      label: 'Établissements scolaires',
      pathPrefix: '/etablissements-scolaires/',
      noFollow: false,
      shouldDisplay: uniteLegale.complements.estUai,
    },
    {
      ficheType: FICHE.DIVERS,
      label: 'Conventions collectives',
      pathPrefix: '/divers/',
      noFollow: false,
      shouldDisplay: (uniteLegale.listeIdcc || []).length > 0,
      width: '130px',
    },
  ];
};

export const Tabs: React.FC<{
  currentFicheType: FICHE;
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ currentFicheType, uniteLegale, session }) => {
  const tabs = getUniteLegaleTabs(uniteLegale, session);
  return (
    <PrintNever>
      <div className={styles.titleTabs}>
        {tabs
          .filter(({ shouldDisplay }) => shouldDisplay)
          .map(
            ({
              fullPath,
              pathPrefix,
              ficheType,
              label,
              noFollow,
              width = 'auto',
            }) => (
              <TabLink
                active={currentFicheType === ficheType}
                href={fullPath || `${pathPrefix}${uniteLegale.siren}`}
                label={label}
                noFollow={noFollow}
                key={label}
                width={width}
              />
            )
          )}
      </div>
    </PrintNever>
  );
};

export const TabsForEtablissement: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const tabs = getUniteLegaleTabs(uniteLegale, session);
  return (
    <ul className={styles.titleTabsEtablissement}>
      {tabs
        .filter(({ shouldDisplay }) => shouldDisplay)
        .map(({ fullPath, pathPrefix, label, noFollow }) => (
          <li>
            <a
              href={fullPath || `${pathPrefix}${uniteLegale.siren}`}
              rel={noFollow ? 'nofollow' : ''}
            >
              <h2>{label}</h2>
            </a>
          </li>
        ))}
    </ul>
  );
};
