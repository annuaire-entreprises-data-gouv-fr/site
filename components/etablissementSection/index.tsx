import React from 'react';
import { Etablissement, UniteLegale } from '../../model';
import { map, pin } from '../../static/icon';
import {
  formatDate,
  formatDateLong,
  formatNumbersFr,
  formatSiret,
} from '../../utils/formatting';
import {
  fullAdress,
  fullLibelleFromCodeNaf,
  libelleFromCategoriesJuridiques,
  managingDirector,
  tvaIntracommunautaire,
} from '../../utils/helper';
import ButtonLink from '../button';
import HorizontalSeparator from '../horizontalSeparator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

const EtablissementSection: React.FC<{
  etablissement: Etablissement;
  uniteLegale: UniteLegale;
  usedInEntreprisePage?: Boolean;
}> = ({ etablissement, uniteLegale, usedInEntreprisePage }) => (
  <>
    {!usedInEntreprisePage && (
      <>
        {uniteLegale.statut_diffusion !== 'N' && (
          <p>
            Cet établissement est
            <b>
              {etablissement.etat_administratif === 'A'
                ? ' en activité'
                : ' fermé'}
              .
            </b>{' '}
            C’est
            {etablissement.etablissement_siege === 'true' ? (
              <b> le siège social</b>
            ) : (
              <> un établissement secondaire</>
            )}{' '}
            de l’entreprise{' '}
            <a href={`/entreprise/${uniteLegale.siren}`}>
              {uniteLegale.nom_complet}
            </a>
            ,
            {uniteLegale.etablissements &&
            uniteLegale.etablissements.length > 1 ? (
              <>
                {' '}
                qui possède au total
                <a href={`/entreprise/${uniteLegale.siren}#etablissements`}>
                  {uniteLegale.etablissements.length} établissements.
                </a>
              </>
            ) : (
              <>
                {' '}
                et
                <a href={`/entreprise/${uniteLegale.siren}#etablissements`}>
                  son unique établissement
                </a>
              </>
            )}
          </p>
        )}
        <p>
          {etablissement.date_creation && (
            <>
              Cet établissement a été crée le{' '}
              {formatDateLong(etablissement.date_creation)}
            </>
          )}{' '}
          {etablissement.geo_adresse && (
            <>
              et il est domicilié au{' '}
              <a href="#contact">{etablissement.geo_adresse}</a>
            </>
          )}
        </p>
      </>
    )}
    <Section
      title={
        usedInEntreprisePage
          ? `Les informations sur le siège social`
          : `Les informations sur cet établissement${
              etablissement.etablissement_siege === 'true'
                ? ' (siège social)'
                : ''
            }`
      }
    >
      <TwoColumnTable
        body={[
          ['SIREN', formatNumbersFr(etablissement.siren)],
          ['SIRET', formatSiret(etablissement.siret)],
          ['Clef NIC', etablissement.nic],
          [
            'N° TVA Intracommunautaire',
            formatNumbersFr(tvaIntracommunautaire(etablissement.siren)),
          ],
          [
            'Activité principale (établissement)',
            fullLibelleFromCodeNaf(etablissement.activite_principale),
          ],
          [
            'Nature juridique',
            libelleFromCategoriesJuridiques(uniteLegale.categorie_juridique),
          ],
          ['Date de création', formatDate(etablissement.date_creation)],
          [
            'Date de dernière mise à jour',
            formatDate(etablissement.date_dernier_traitement),
          ],
          ['Tranche d’effectif salarié', etablissement.tranche_effectifs || ''],
        ]}
      />
    </Section>
    <div className="section-wrapper" id="contact">
      <Section title="Les informations de contact">
        <TwoColumnTable
          body={[
            ['Gérant', managingDirector(uniteLegale) || ''],
            ['Adresse', fullAdress(etablissement)],
          ]}
        />
      </Section>
      <div className="map">
        {map}
        <div className="layout-center">
          <ButtonLink
            href={`/rechercher/carte?siret=${etablissement.siret}`}
            alt
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
        max-height: 160px;
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
export default EtablissementSection;
