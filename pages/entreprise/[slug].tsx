import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import ButtonLink from '../../components/button';
import {
  formatDate,
  formatDateLong,
  formatNumbersFr,
  formatSiret,
} from '../../utils/formatting';
import { Tag } from '../../components/tag';
import { Section } from '../../components/section';
import { FullTable } from '../../components/table/full';
import { TwoColumnTable } from '../../components/table/simple';
import {
  fullAdress,
  fullLibelleFromCodeNaf,
  getCompanyTitle,
  libelleFromCategoriesJuridiques,
  libelleFromCodeNaf,
  managingDirector,
  tvaIntracommunautaire,
} from '../../utils/helper';
import {
  Etablissement,
  getEtablissement,
  getUniteLegale,
  UniteLegale,
} from '../../model';
import { download, map, pin } from '../../static/icon';

interface IProps {
  etablissement: Etablissement;
  uniteLegale: UniteLegale;
}

const About: React.FC<IProps> = ({ etablissement, uniteLegale }) => (
  <Page small={true} useMapbox={true}>
    <div className="content-container">
      <div className="header-section">
        <div className="title">
          <h1>{getCompanyTitle(uniteLegale)}</h1>
          {etablissement.etat_administratif === 'A' ? (
            <Tag className="open">en activité</Tag>
          ) : (
            <Tag className="closed">fermé</Tag>
          )}
        </div>
        <div className="cta">
          <ButtonLink
            target="_blank"
            href={`/api/immatriculation?siren=${etablissement.siren}?format=pdf`}
          >
            {download}
            <span style={{ width: '5px' }} />
            Justificatif d'immatriculation
          </ButtonLink>
          <span style={{ width: '5px' }} />
          <ButtonLink
            target="_blank"
            href={`/api/immatriculation?siren=${etablissement.siren}`}
            alt
          >
            Fiche d'immatriculation
          </ButtonLink>
        </div>
      </div>
      <p>
        L’entreprise {getCompanyTitle(uniteLegale)}{' '}
        {uniteLegale.categorie_juridique && (
          <>
            est une{' '}
            <b>
              {libelleFromCategoriesJuridiques(uniteLegale.categorie_juridique)}
            </b>{' '}
          </>
        )}
        {etablissement.date_creation && (
          <>crée le {formatDateLong(etablissement.date_creation)}</>
        )}{' '}
        {etablissement.geo_adresse && (
          <>
            et domicilié au <a href="#contact">{etablissement.geo_adresse}</a>
          </>
        )}
        .
      </p>
      <p>
        Cet établissement est
        <b>
          {etablissement.etat_administratif === 'A' ? ' en activité' : ' fermé'}
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
          {getCompanyTitle(uniteLegale)}
        </a>
        ,
        {uniteLegale.etablissements && uniteLegale.etablissements.length > 1 ? (
          <>
            {' '}
            qui possède au total
            <a href="#etablissements">
              {uniteLegale.etablissements.length} établissements.
            </a>
          </>
        ) : (
          <>
            {' '}
            et <a href="#etablissements">son unique établissement</a>
          </>
        )}
      </p>
      <Section
        title={`Les informations sur cet établissement${
          etablissement.etablissement_siege === 'true' ? ' (siège social)' : ''
        }`}
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
            [
              'Tranche d’effectif salarié',
              etablissement.tranche_effectifs || '',
            ],
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
            <ButtonLink href={`/carte?siret=${etablissement.siret}`} alt>
              {pin}
              Afficher sur la carte
            </ButtonLink>
          </div>
        </div>
      </div>
      <Section
        title="La liste des établissements de l'entreprise"
        id="etablissements"
      >
        <FullTable
          head={['SIRET', 'Activité (code NAF)', 'Adresse', 'Statut']}
          body={uniteLegale.etablissements.map((elem: any) => [
            <a href={`/entreprise/${elem.siret}`}>{formatSiret(elem.siret)}</a>,
            <>
              {elem.activite_principale} -{' '}
              {libelleFromCodeNaf(elem.activite_principale)}
            </>,
            elem.geo_adresse,
            <>
              {elem.etablissement_siege === 'true' ? (
                <Tag>siège social</Tag>
              ) : null}
              {elem.etat_administratif === 'A' ? null : (
                <Tag className="closed">fermé</Tag>
              )}
            </>,
          ])}
        />
      </Section>
    </div>
    <style jsx>{`
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .title {
        display: flex;
        align-items: center;
      }
      .title h1 {
        margin-right: 10px;
      }
      .content-container {
        margin: 20px auto 40px;
      }
      .section-wrapper {
        display: flex;
      }
      .section-wrapper .map {
        background-color: #fff;
        max-height: 120px;
        overflow: hidden;
        width: 220px;
        flex-shrink: 0;
        margin: 40px 0 10px 20px;
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

      .cta {
        flex-direction: row;
        display: flex;
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siretOrSiren = context.params.slug;

  if (siretOrSiren && siretOrSiren.length === 9) {
    // siege social
    const uniteLegale = await getUniteLegale(siretOrSiren as string);
    return {
      props: {
        etablissement: uniteLegale.etablissement_siege,
        uniteLegale,
      },
    };
  }

  const etablissement = await getEtablissement(siretOrSiren as string);
  const uniteLegale = await getUniteLegale(etablissement.siren as string);

  return {
    props: {
      etablissement,
      uniteLegale,
    },
  };
};

export default About;
