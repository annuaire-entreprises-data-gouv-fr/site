import React from 'react';
import { IEtablissement, IUniteLegale } from '../../models';
import { map, pin } from '../icon';
import { formatDate, formatIntFr } from '../../utils/helpers/formatting';
import ButtonLink from '../button';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import { EAdministration } from '../../models/administration';
import AvisSituationLink from '../avis-situation-link';
import { EtablissementDescription } from '../etablissement-description';
import BreakPageForPrint from '../print-break-page';
import { PrintNever } from '../print-visibility';

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
    ['SIRET', formatSiret(etablissement.siret)],
    ['Clef NIC', etablissement.nic],
    ['N° TVA Intracommunautaire', formatIntFr(uniteLegale.numeroTva)],
    [
      'Activité principale de l’établissement (NAF/APE)',
      etablissement.libelleActivitePrincipale,
    ],
    ['Nature juridique', uniteLegale.libelleNatureJuridique],
    ['Tranche d’effectif salarié', etablissement.libelleTrancheEffectif],
    ['Date de création', formatDate(etablissement.dateCreation)],
    [
      'Date de dernière mise à jour',
      formatDate(etablissement.dateDerniereMiseAJour),
    ],
    [
      'Avis de situation INSEE',
      // eslint-disable-next-line
      <AvisSituationLink siret={etablissement.siret} />,
    ],
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
  if (etablissement.denomination) {
    data.splice(0, 0, ['Nom commercial', etablissement.denomination]);
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
      >
        <TwoColumnTable body={data} />
      </Section>
      <div className="section-wrapper" id="contact">
        <Section
          title="Les informations de contact"
          source={EAdministration.INSEE}
        >
          <TwoColumnTable body={[['Adresse', etablissement.adresse]]} />
          {uniteLegale.estEntrepreneurIndividuel && (
            <p className="faq-entrepreneur-individuels">
              <i>
                Pour en savoir plus sur l’affichage des adresses{' '}
                <a href="/faq">consultez notre FAQ</a>
              </i>
            </p>
          )}
        </Section>
        {etablissement.adresse && (
          <PrintNever>
            <div className="map">
              {map}
              <div className="layout-center">
                <ButtonLink to={`/carte/${etablissement.siret}`} alt nofollow>
                  {pin}
                  Afficher sur la carte
                </ButtonLink>
              </div>
            </div>
          </PrintNever>
        )}
      </div>
      <HorizontalSeparator />
      <BreakPageForPrint />
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
