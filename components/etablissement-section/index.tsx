import React from 'react';
import { IEtablissement, IUniteLegale } from '../../models';
import { map, pin } from '../icon';
import {
  formatDate,
  formatDateLong,
  formatNumbersFr,
} from '../../utils/helpers/formatting';
import ButtonLink from '../button';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import { EAdministration } from '../../models/administration';
import AvisSituation from '../avis-situation';

interface IProps {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  usedInEntreprisePage?: Boolean;
}

const Details: React.FC<IProps> = ({ etablissement, uniteLegale }) => (
  <>
    {uniteLegale.estDiffusible && (
      <p>
        Cet établissement est
        <b>{etablissement.estActif ? ' en activité' : ' fermé'}.</b> C’est
        {etablissement.estSiege ? (
          <b> le siège social</b>
        ) : (
          <> un établissement secondaire</>
        )}{' '}
        de l’entité{' '}
        <a href={`/entreprise/${uniteLegale.siren}`}>
          {uniteLegale.nomComplet}
        </a>
        ,
        {uniteLegale.etablissements && uniteLegale.etablissements.length > 1 ? (
          <>
            {' '}
            qui possède au total{' '}
            <a href={`/entreprise/${uniteLegale.siren}#etablissements`}>
              {uniteLegale.etablissements.length} établissements.
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
      {etablissement.dateCreation && (
        <>
          Cet établissement a été crée le{' '}
          <b>{formatDateLong(etablissement.dateCreation)}</b>
        </>
      )}{' '}
      {etablissement.dateDebutActivite && !etablissement.estActif && (
        <>
          et il a été fermé le{' '}
          <b>{formatDateLong(etablissement.dateDebutActivite)}</b>
        </>
      )}{' '}
      {etablissement.adresse && (
        <>
          et il est domicilié au <a href="#contact">{etablissement.adresse}</a>
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
    ['N° TVA Intracommunautaire', formatNumbersFr(uniteLegale.numeroTva)],
    [
      'Activité principale (établissement)',
      etablissement.libelleActivitePrincipale,
    ],
    ['Nature juridique', uniteLegale.libelleNatureJuridique],
    ['Tranche d’effectif salarié', etablissement.libelleTrancheEffectif],
    ['Date de création', formatDate(etablissement.dateCreation)],
    [
      'Date de dernière mise à jour',
      formatDate(etablissement.dateDerniereMiseAJour),
    ],
    ['Avis de situation INSEE', <AvisSituation siret={etablissement.siret} />],
  ];

  if (!etablissement.estActif) {
    data.push([
      'Date de fermeture',
      formatDate(etablissement.dateDebutActivite),
    ]);
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
                etablissement.estSiege ? ' (siège social)' : ''
              }`
        }
        source={EAdministration.INSEE}
      >
        <TwoColumnTable body={data} />
      </Section>
      <div className="section-wrapper" id="contact">
        <Section
          title="Les informations de contact"
          source={EAdministration.INSEE}
        >
          <TwoColumnTable body={[['Adresse', etablissement.adresse]]} />
        </Section>
        {etablissement.longitude && etablissement.latitude && (
          <div className="map">
            {map}
            <div className="layout-center">
              <ButtonLink href={`/carte/${etablissement.siret}`} alt nofollow>
                {pin}
                Afficher sur la carte
              </ButtonLink>
            </div>
          </div>
        )}
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
