import React from 'react';
import AssociationAdressAlert from '#components-ui/alerts/association-adress';
import MultipleSirenAlert from '#components-ui/alerts/multiple-siren';
import IsActiveTag from '#components-ui/is-active-tag';
import { PrintNever } from '#components-ui/print-visibility';
import SocialMedia from '#components-ui/social-media';
import { Tag } from '#components-ui/tag';
import UniteLegaleBadge from '#components/unite-legale-badge';
import { UnitLegaleDescription } from '#components/unite-legale-description';
import { checkHasLabelsAndCertificates } from '#components/unite-legale-section/labels-and-certificates';
import {
  isAssociation,
  isCollectiviteTerritoriale,
  IUniteLegale,
} from '#models/index';
import { estNonDiffusible } from '#models/statut-diffusion';
import { formatIntFr } from '#utils/helpers';

export enum FICHE {
  ACTES = 'actes & statuts',
  ANNONCES = 'annonces',
  CERTIFICATS = 'Labels ou certifications',
  COMPTES = 'bilans & comptes',
  DIRIGEANTS = 'dirigeants',
  DIVERS = 'conventions collectives',
  ELUS = 'élus',
  ETABLISSEMENTS_SCOLAIRES = 'établissements scolaires',
  INFORMATION = 'informations générales',
  JUSTIFICATIFS = 'justificatifs',
  OCTROI = 'octroi',
}

interface IProps {
  ficheType?: FICHE;
  uniteLegale: IUniteLegale;
}

const Tabs: React.FC<{
  currentFicheType: FICHE;
  uniteLegale: IUniteLegale;
}> = ({ currentFicheType, uniteLegale }) => {
  const tabs = [
    {
      ficheType: FICHE.INFORMATION,
      label: 'Informations générales',
      pathPrefix: '/entreprise/',
      noFollow: false,
      shouldDisplay: true,
    },
    {
      ficheType: FICHE.JUSTIFICATIFS,
      label: 'Justificatif d’immatriculation',
      pathPrefix: '/justificatif/',
      noFollow: true,
      shouldDisplay: true,
    },
    {
      ficheType: FICHE.ELUS,
      label: 'Élus',
      pathPrefix: '/elus/',
      noFollow: true,
      shouldDisplay: isCollectiviteTerritoriale(uniteLegale),
    },
    {
      ficheType: FICHE.DIRIGEANTS,
      label: 'Dirigeants',
      pathPrefix: '/dirigeants/',
      noFollow: true,
      shouldDisplay: !isCollectiviteTerritoriale(uniteLegale),
    },
    {
      ficheType: FICHE.ANNONCES,
      label: 'Annonces',
      pathPrefix: '/annonces/',
      noFollow: true,
      shouldDisplay: true,
    },
    {
      ficheType: FICHE.CERTIFICATS,
      label: 'Labels et certificats',
      pathPrefix: '/labels-certificats/',
      noFollow: true,
      shouldDisplay: checkHasLabelsAndCertificates(uniteLegale),
    },
    {
      ficheType: FICHE.ETABLISSEMENTS_SCOLAIRES,
      label: 'Établissements scolaires',
      pathPrefix: '/etablissements-scolaires/',
      noFollow: true,
      shouldDisplay: uniteLegale.complements.estUai,
    },
    {
      ficheType: FICHE.DIVERS,
      label: 'Conventions collectives',
      pathPrefix: '/divers/',
      noFollow: true,
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
            >
              {label}
            </a>
          ))}
        <a
          className={`${
            currentFicheType === FICHE.OCTROI ? 'active' : ''
          } no-style-link`}
          href={`/octroi/${uniteLegale.siren}`}
        >
          Marchés publics <span className="beta">beta</span>
        </a>
      </div>
      <style jsx>{`
        .title-tabs {
          display: flex;
          flex-grow: 1;
          font-size: 0.9rem;
          border-bottom: 2px solid #dfdff1;
        }
        .title-tabs > a {
          color: #000091;
          font-weight: bold;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          margin: 0 4px;
          padding: 10px 5px;
          border: 2px solid #dfdff1;
          background-color: #efeffb;
          margin-bottom: -2px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 -8px 5px -5px #dfdff1 inset;
        }

        .title-tabs > a:hover {
          background-color: #dfdff1;
        }

        .title-tabs > a.active {
          box-shadow: none;
          background-color: #fff;
          border-bottom: 0;
        }
        .title-tabs > a > span.beta {
          border-radius: 45px;
          margin: 0 5px;
          padding: 0 8px;
          background-color: #640091;
          color: #fbeff9;
          font-variant: small-caps;
          font-size: 0.8rem;
        }

        @media only screen and (min-width: 1px) and (max-width: 650px) {
          .title-tabs {
            flex-direction: column;
            border-bottom: 0;
          }
          .title-tabs > a {
            margin: 3px;
          }
          .title-tabs > a.active {
            background-color: #fff;
            border-bottom: 2px solid #dfdff1;
          }
        }
      `}</style>
    </PrintNever>
  );
};

const Title: React.FC<IProps> = ({
  ficheType = FICHE.INFORMATION,
  uniteLegale,
}) => (
  <div className="header-section">
    <div className="title">
      <MultipleSirenAlert uniteLegale={uniteLegale} />
      {isAssociation(uniteLegale) && (
        <AssociationAdressAlert uniteLegale={uniteLegale} />
      )}
      <h1>
        <a href={`/entreprise/${uniteLegale.siren}`}>
          {uniteLegale.nomComplet}
        </a>
      </h1>
      <div className="unite-legale-sub-title">
        <UniteLegaleBadge uniteLegale={uniteLegale} />
        <span className="siren">
          &nbsp;‣&nbsp;{formatIntFr(uniteLegale.siren)}
        </span>
        <span>
          {estNonDiffusible(uniteLegale) && (
            <Tag className="unknown">non-diffusible</Tag>
          )}
          <IsActiveTag
            etatAdministratif={uniteLegale.etatAdministratif}
            statutDiffusion={uniteLegale.statutDiffusion}
          />
        </span>
      </div>
    </div>
    <SocialMedia uniteLegale={uniteLegale} />
    {estNonDiffusible(uniteLegale) ? (
      <p>Les informations concernant cette entreprise ne sont pas publiques.</p>
    ) : (
      <UnitLegaleDescription uniteLegale={uniteLegale} />
    )}
    <Tabs uniteLegale={uniteLegale} currentFicheType={ficheType} />

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

      @media only screen and (min-width: 1px) and (max-width: 900px) {
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
