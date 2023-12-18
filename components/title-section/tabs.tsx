import { PrintNever } from '#components-ui/print-visibility';
import {
  checkHasLabelsAndCertificates,
  checkHasQuality,
} from '#components/labels-and-certificates-badges-section';
import constants from '#models/constants';
import {
  IUniteLegale,
  isCollectiviteTerritoriale,
  isServicePublic,
} from '#models/index';
import { ISession, isAgent } from '#utils/session';

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
  JUSTIFICATIFS = 'justificatifs',
  ETABLISSEMENT = 'fiche établissement',
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
      ficheType: FICHE.JUSTIFICATIFS,
      label: 'Justificatif d’immatriculation',
      pathPrefix: '/justificatif/',
      noFollow: false,
      shouldDisplay: true,
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
      shouldDisplay: isAgent(session),
      width: '110px',
    },
    {
      ficheType: FICHE.FINANCES,
      label: 'Données financières',
      pathPrefix: '/donnees-financieres/',
      noFollow: false,
      shouldDisplay: shouldDisplayFinances,
      width: '110px',
    },
    {
      ficheType: FICHE.ANNONCES,
      label: 'Annonces',
      pathPrefix: '/annonces/',
      noFollow: false,
      shouldDisplay: true,
    },
    {
      ficheType: FICHE.CERTIFICATS,
      label: `${
        checkHasQuality(uniteLegale) ? 'Qualités, l' : 'L'
      }abels et certificats`,
      pathPrefix: '/labels-certificats/',
      noFollow: false,
      shouldDisplay: checkHasLabelsAndCertificates(uniteLegale),
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
      shouldDisplay:
        Object.keys(uniteLegale.conventionsCollectives || {}).length > 0,
      width: '130px',
    },
  ];
  return (
    <PrintNever>
      <div className="title-tabs">
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
              <a
                className={`${
                  currentFicheType === ficheType ? 'active' : ''
                } no-style-link`}
                href={fullPath || `${pathPrefix}${uniteLegale.siren}`}
                rel={noFollow ? 'nofollow' : ''}
                key={label}
                style={{ width }}
              >
                {currentFicheType === ficheType ? label : <h2>{label}</h2>}
              </a>
            )
          )}
        {currentFicheType === FICHE.ETABLISSEMENT && (
          <>
            <div style={{ flexGrow: 1 }} />
            <a
              className="active no-style-link"
              key="etablissement"
              href=""
              style={{ width: '120px' }}
            >
              <h2>Fiche établissement</h2>
            </a>
          </>
        )}
      </div>

      <style jsx>{`
        .title-tabs {
          display: flex;
          flex-grow: 1;
          font-size: 0.9rem;
          border-bottom: 2px solid ${constants.colors.pastelBlue};
        }
        .title-tabs > a {
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          border: 2px solid ${constants.colors.pastelBlue};
          background-color: #efeffb;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 -8px 5px -5px ${constants.colors.pastelBlue} inset;
          margin: 0 4px;
          padding: 5px;
          margin-bottom: -2px;
        }

        .title-tabs > a,
        .title-tabs > a > h2 {
          color: ${constants.colors.frBlue};
          font-weight: bold;
          font-size: 0.9rem;
          line-height: 1.1rem;
          max-width: 150px;
        }

        .title-tabs > a > h2 {
          margin: 0;
          padding: 0;
        }

        .title-tabs > a:hover {
          background-color: ${constants.colors.pastelBlue};
        }

        .title-tabs > a.active {
          box-shadow: none;
          background-color: #fff;
          border-bottom: 0;
        }

        @media only screen and (min-width: 1px) and (max-width: 768px) {
          .title-tabs {
            flex-direction: column;
            border-bottom: 0;
          }

          .title-tabs > a,
          .title-tabs > a > h2 {
            margin: 3px;
            padding: 3px;
            max-width: none;
            width: auto !important;
          }

          .title-tabs > a.active {
            background-color: #fff;
            border-bottom: 2px solid ${constants.colors.pastelBlue};
            line-height: 1.8rem;
          }
        }
      `}</style>
    </PrintNever>
  );
};
