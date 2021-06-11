import React from 'react';
import { IEtablissement, IUniteLegale } from '../../models';
import { map, pin } from '../icon';
import { formatDate, formatNumbersFr } from '../../utils/helpers/formatting';
import ButtonLink from '../button';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import { EAdministration } from '../../models/administration';
import AvisSituation from '../avis-situation';
import { EtablissementDescription } from '../etablissement-description';
import InformationTooltip from '../information-tooltip';

interface IProps {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  usedInEntreprisePage?: Boolean;
}

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

  if (etablissement.estActif === false) {
    data.push([
      'Date de fermeture',
      formatDate(etablissement.dateFermeture || ''),
    ]);
  }
  if (etablissement.enseigne) {
    data.splice(0, 0, ['Enseigne de l’établissement', etablissement.enseigne]);
  }

  return (
    <>
      {!usedInEntreprisePage && (
        <EtablissementDescription
          etablissement={etablissement}
          uniteLegale={uniteLegale}
        />
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
        sourceLastUpdatedAt={formatDate(etablissement.dateDerniereMiseAJour)}
      >
        <TwoColumnTable body={data} />
      </Section>
      <div className="section-wrapper" id="contact">
        <Section
          title="Les informations de contact"
          source={EAdministration.INSEE}
          sourceLastUpdatedAt={formatDate(uniteLegale.dateDerniereMiseAJour)}
        >
          <TwoColumnTable body={[['Adresse', etablissement.adresse]]} />
          {uniteLegale.estEntrepreneurIndividuel && (
            <p className="faq-entrepreneur-individuels">
              <i>
                Pour en savoir plus sur l'affichage des adresses{' '}
                <a href="/faq">consultez notre FAQ</a>
              </i>
            </p>
          )}
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

        .faq-entrepreneur-individuels {
          margin: 10px;
          font-size: 0.9rem;
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
