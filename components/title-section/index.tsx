import React from 'react';
import AssociationAdressAlert from '#components-ui/alerts/association-adress';
import MultipleSirenAlert from '#components-ui/alerts/multiple-siren';
import NonDiffusibleAlert from '#components-ui/alerts/non-diffusible';
import ProtectedData from '#components-ui/alerts/protected-data';
import { Icon } from '#components-ui/icon/wrapper';
import IsActiveTag from '#components-ui/is-active-tag';
import { PrintNever } from '#components-ui/print-visibility';
import SocialMedia from '#components-ui/social-media';
import { Tag } from '#components-ui/tag';
import { checkHasLabelsAndCertificates } from '#components/labels-and-certificates-badges-section';
import UniteLegaleBadge from '#components/unite-legale-badge';
import { UniteLegaleDescription } from '#components/unite-legale-description';
import constants from '#models/constants';
import {
  isAssociation,
  isCollectiviteTerritoriale,
  isServicePublic,
  IUniteLegale,
} from '#models/index';
import {
  estDiffusible,
  estNonDiffusible,
  getNomComplet,
} from '#models/statut-diffusion';
import { formatIntFr } from '#utils/helpers';
import { ISession, isLoggedIn } from '#utils/session';

export enum FICHE {
  ACTES = 'actes & statuts',
  ANNONCES = 'annonces',
  FINANCES = 'finances',
  CERTIFICATS = 'Labels ou certifications',
  COMPTES = 'bilans & comptes',
  DIRIGEANTS = 'dirigeants',
  DIVERS = 'conventions collectives',
  ELUS = 'élus',
  ETABLISSEMENTS_SCOLAIRES = 'établissements scolaires',
  INFORMATION = 'résumé',
  JUSTIFICATIFS = 'justificatifs',
}

type IProps = {
  ficheType?: FICHE;
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

const Tabs: React.FC<{
  currentFicheType: FICHE;
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ currentFicheType, uniteLegale, session }) => {
  const tabs = [
    {
      ficheType: FICHE.INFORMATION,
      label: 'Résumé',
      pathPrefix: '/entreprise/',
      noFollow: false,
      shouldDisplay: true,
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
      ficheType: FICHE.FINANCES,
      label: 'Données financières',
      pathPrefix: '/donnees-financieres/',
      noFollow: false,
      shouldDisplay:
        !isServicePublic(uniteLegale) && !isAssociation(uniteLegale),
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
      label: 'Labels et certificats',
      pathPrefix: '/labels-certificats/',
      noFollow: false,
      shouldDisplay: checkHasLabelsAndCertificates(uniteLegale),
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
      shouldDisplay: true,
    },
  ];
  return (
    <PrintNever>
      <div className="title-tabs">
        {tabs
          .filter(({ shouldDisplay }) => shouldDisplay)
          .map(({ pathPrefix, ficheType, label, noFollow }) => (
            <a
              className={`${
                currentFicheType === ficheType ? 'active' : ''
              } no-style-link`}
              href={`${pathPrefix}${uniteLegale.siren}`}
              rel={noFollow ? 'nofollow' : ''}
              key={label}
            >
              {currentFicheType === ficheType ? label : <h2>{label}</h2>}
            </a>
          ))}
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
          max-width: 160px;
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
          .title-tabs > a {
            margin: 3px;
          }
          .title-tabs > a.active {
            background-color: #fff;
            border-bottom: 2px solid ${constants.colors.pastelBlue};
          }
        }
      `}</style>
    </PrintNever>
  );
};

const Title: React.FC<IProps> = ({
  ficheType = FICHE.INFORMATION,
  uniteLegale,
  session,
}) => (
  <div className="header-section">
    <div className="title">
      {isLoggedIn(session) && (
        <ProtectedData full>
          Vous êtes connecté avec un compte <b>agent public</b>. Ce compte vous
          donne accés à certaines données exclusivement réservées à
          l’administration, identifiables par la mention “
          <Icon size={12} slug="lockFill">
            Réservé aux agents publics
          </Icon>
          ” .
        </ProtectedData>
      )}
      {!estDiffusible(uniteLegale) && (
        <>
          {isLoggedIn(session) ? (
            <ProtectedData full>
              Cette structure est non-diffusible mais vous pouvez voir ses
              informations grâce à votre compte <b>agent-public</b>.
            </ProtectedData>
          ) : (
            <NonDiffusibleAlert />
          )}
        </>
      )}
      <MultipleSirenAlert uniteLegale={uniteLegale} />
      {isAssociation(uniteLegale) && (
        <AssociationAdressAlert uniteLegale={uniteLegale} session={session} />
      )}
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
    </div>
    <SocialMedia uniteLegale={uniteLegale} session={session} />
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
    <style jsx>{`
      .header-section {
        display: block;
        margin-bottom: 40px;
      }

      .title {
        margin: 40px 0 0;
        display: flex;
        align-items: start;
        flex-direction: column;
        justify-content: center;
      }
      .title h1 {
        margin: 0;
        margin-bottom: 7px;
        line-height: 2.5rem;
      }
      .title h1 > a {
        margin: 0;
        padding: 0;
        font-variant: all-small-caps;
      }

      .unite-legale-sub-title {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 5px;
      }
      .unite-legale-sub-title > span.siren {
        font-variant: small-caps;
        font-size: 1.1rem;
        color: #666;
      }

      @media only screen and (min-width: 1px) and (max-width: 992px) {
        .title {
          margin-top: 10px;
        }
        .header-section {
          justify-content: start;
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `}</style>
  </div>
);

export default Title;
