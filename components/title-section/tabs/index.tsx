import { PrintNever } from '#components-ui/print-visibility';
import {
  checkHasLabelsAndCertificates,
  checkHasQuality,
} from '#components/badges-section/labels-and-certificates';
import {
  IUniteLegale,
  isCollectiviteTerritoriale,
  isServicePublic,
} from '#models/core/types';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
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
  ELUS = 'élus',
  ETABLISSEMENTS_SCOLAIRES = 'établissements scolaires',
  ETABLISSEMENTS = 'listes des établissements',
}

export const Tabs: React.FC<{
  currentFicheType: FICHE;
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ currentFicheType, uniteLegale, session }) => {
  const shouldDisplayFinances =
    // hide for public services
    !isServicePublic(uniteLegale) &&
    // hide for EI
    !uniteLegale.complements.estEntrepreneurIndividuel;

  const tabs = [
    {
      ficheType: FICHE.INFORMATION,
      label: `Fiche résumé`,
      fullPath: `/entreprise/${uniteLegale.chemin}`,
      noFollow: false,
      shouldDisplay: true,
      width: '80px',
    },
    {
      ficheType: FICHE.ETABLISSEMENTS,
      label: `Liste des établissements`,
      fullPath: `/etablissements/${uniteLegale.siren}`,
      noFollow: false,
      shouldDisplay: true,
      width: '120px',
    },
    {
      ficheType: FICHE.ELUS,
      label: 'Élus',
      pathPrefix: '/elus/',
      noFollow: false,
      shouldDisplay: isCollectiviteTerritoriale(uniteLegale),
    },
    {
      ficheType: FICHE.DIRIGEANTS,
      label: 'Dirigeants',
      pathPrefix: '/dirigeants/',
      noFollow: false,
      shouldDisplay: !isCollectiviteTerritoriale(uniteLegale),
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
      width: checkHasQuality(uniteLegale) ? '200px' : '100px',
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
      width: '110px',
    },
  ];
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
