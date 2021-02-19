import React from 'react';
import { IEtablissement, IUniteLegale } from '../../models';
import { map, pin } from '../icon';
import {
  formatDate,
  formatDateLong,
  formatNumbersFr,
} from '../../utils/helpers/formatting';
import {
  fullAdress,
  fullLibelleFromCodeNaf,
  libelleFromCategoriesJuridiques,
  libelleFromCodeEffectif,
} from '../../utils/labels';
import ButtonLink from '../button';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { formatSiret } from '../../utils/helpers/siren-and-siret';

interface IProps {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  usedInEntreprisePage?: Boolean;
}

const Details: React.FC<IProps> = ({ etablissement, uniteLegale }) => (
  <>
    {uniteLegale.isDiffusible && (
      <p>
        Cet établissement est
        <b>{etablissement.isActive ? ' en activité' : ' fermé'}.</b> C’est
        {etablissement.isSiege ? (
          <b> le siège social</b>
        ) : (
          <> un établissement secondaire</>
        )}{' '}
        de l’entité{' '}
        <a href={`/entreprise/${uniteLegale.siren}`}>{uniteLegale.fullName}</a>,
        {uniteLegale.etablissementList &&
        uniteLegale.etablissementList.length > 1 ? (
          <>
            {' '}
            qui possède au total{' '}
            <a href={`/entreprise/${uniteLegale.siren}#etablissements`}>
              {uniteLegale.etablissementList.length} établissements.
            </a>
          </>
        ) : (
          <>
            {' '}
            et{' '}
            <a href={`/entreprise/${uniteLegale.siren}#etablissements`}>
              son unique établissement
            </a>
          </>
        )}
      </p>
    )}
    <p>
      {etablissement.creationDate && (
        <>
          Cet établissement a été crée le{' '}
          <b>{formatDateLong(etablissement.creationDate)}</b>
        </>
      )}{' '}
      {etablissement.firstUpdateDate && !etablissement.isActive && (
        <>
          et il a été fermé le{' '}
          <b>{formatDateLong(etablissement.firstUpdateDate)}</b>
        </>
      )}{' '}
      {etablissement.adress && (
        <>
          et il est domicilié au <a href="#contact">{etablissement.adress}</a>
        </>
      )}
    </p>
  </>
);

const EtablissementSection: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  usedInEntreprisePage,
}) => {
  const data = [
    ['SIREN', formatNumbersFr(etablissement.siren)],
    ['SIRET', formatSiret(etablissement.siret)],
    ['Clef NIC', etablissement.nic],
    ['N° TVA Intracommunautaire', formatNumbersFr(uniteLegale.tvaNumber)],
    [
      'Activité principale (établissement)',
      fullLibelleFromCodeNaf(etablissement.mainActivity),
    ],
    [
      'Nature juridique',
      libelleFromCategoriesJuridiques(uniteLegale.companyLegalStatus),
    ],
    [
      'Tranche d’effectif salarié',
      libelleFromCodeEffectif(etablissement.headcount),
    ],
    ['Date de création', formatDate(etablissement.creationDate)],
    ['Date de dernière mise à jour', formatDate(etablissement.lastUpdateDate)],
  ];

  if (!etablissement.isActive) {
    data.push(['Date de fermeture', formatDate(etablissement.firstUpdateDate)]);
  }
  if (etablissement.enseigne) {
    data.splice(0, 0, ['Enseigne de l’établissement', etablissement.enseigne]);
  }

  return (
    <>
      {!usedInEntreprisePage && (
        <Details etablissement={etablissement} uniteLegale={uniteLegale} />
      )}
      <Section
        title={
          usedInEntreprisePage
            ? `Les informations sur le siège social`
            : `Les informations sur cet établissement${
                etablissement.isSiege ? ' (siège social)' : ''
              }`
        }
      >
        <TwoColumnTable body={data} />
      </Section>
      <div className="section-wrapper" id="contact">
        <Section title="Les informations de contact">
          <TwoColumnTable body={[['Adresse', fullAdress(etablissement)]]} />
        </Section>
        <div className="map">
          {map}
          <div className="layout-center">
            <ButtonLink
              href={`/rechercher/carte?siret=${etablissement.siret}`}
              alt
              nofollow
            >
              {pin}
              Afficher sur la carte
            </ButtonLink>
          </div>
        </div>
      </div>
      <HorizontalSeparator />
      <style jsx>{`
        .section-wrapper {
          display: flex;
          flex-direction: row;
        }
        .section-wrapper .map {
          background-color: #fff;
          max-height: 130px;
          overflow: hidden;
          width: 220px;
          flex-shrink: 0;
          margin: 10px 0 10px 20px;
          position: relative;
        }
        .section-wrapper .map > svg {
          width: 100%;
        }
        .section-wrapper .map > div {
          position: absolute;
          bottom: 0;
          height: 100%;
          width: 100%;
        }

        @media only screen and (min-width: 1px) and (max-width: 600px) {
          .section-wrapper {
            flex-direction: column;
          }

          .section-wrapper .map {
            flex-direction: column;
            width: 100%;
            margin: auto;
          }
        }
      `}</style>
    </>
  );
};
export default EtablissementSection;
