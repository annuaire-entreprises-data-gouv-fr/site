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
  isSirenOrSiret,
  libelleFromCategoriesJuridiques,
  libelleFromCodeNaf,
  managingDirector,
  tvaIntracommunautaire,
} from '../../utils/helper';

interface IProps {
  etablissement: any;
  uniteLegale: any;
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
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
          <svg
            viewBox="0 0 180 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M68.5 29.5V48H87L87 29.5L68.5 29.5Z" fill="#C3E095" />
            <path
              d="M84 52.5L1.90735e-06 154.5L1.14441e-05 52.5L84 52.5Z"
              fill="#DFDFF1"
            />
            <path
              d="M87.5 57.5L1.90735e-06 165L0 180L87.5 180L87.5 57.5Z"
              fill="#DFDFF1"
            />
            <path d="M95.5 136L95.5 180L180 180V136L95.5 136Z" fill="#DFDFF1" />
            <path
              d="M95.5 128.5L180 128.5V108L95.5 85.5L95.5 128.5Z"
              fill="#DFDFF1"
            />
            <path
              d="M95.5 74.5L180 95.5L180 29.5L95.5 29.5V74.5Z"
              fill="#DFDFF1"
            />
            <path d="M155 23H180V1.52588e-05H155V23Z" fill="#DFDFF1" />
            <path
              d="M147 1.52588e-05V23L95.5 23L95.5 1.52588e-05L147 1.52588e-05Z"
              fill="#DFDFF1"
            />
            <path
              d="M87.5 23H61.0001L37 1.52588e-05H87.5L87.5 23Z"
              fill="#DFDFF1"
            />
            <path
              d="M31 1.52588e-05L61.0001 29.5L61.0001 47.5H1.14441e-05L1.63321e-05 0L31 1.52588e-05Z"
              fill="#DFDFF1"
            />
          </svg>
          <div className="layout-center">
            <ButtonLink
              href={`/carte?lat=${etablissement.latitude}&lng=${etablissement.longitude}`}
              alt
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
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
        bottom: 15px;
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

  if (!siretOrSiren || !isSirenOrSiret(siretOrSiren as string)) {
    context.res.writeHead(404, {
      Location: `/404`,
    });
    context.res.end();
  }

  if (siretOrSiren && siretOrSiren.length === 9) {
    // siege social
    const uniteLegaleRequest = await fetch(
      `https://entreprise.data.gouv.fr/api/sirene/v3/unites_legales/${encodeURI(
        //@ts-ignore
        siretOrSiren
      )}`
    );

    const uniteLegale = await uniteLegaleRequest.json();

    return {
      props: {
        etablissement: uniteLegale.unite_legale.etablissement_siege,
        uniteLegale: uniteLegale.unite_legale,
      },
    };
  } else {
    const etablissementRequest = await fetch(
      `https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/${encodeURI(
        //@ts-ignore
        siretOrSiren
      )}`
    );

    if (etablissementRequest.status === 404) {
      context.res.statusCode = 404;
      context.res.end();
    }

    const { etablissement } = await etablissementRequest.json();

    const uniteLegaleRequest = await fetch(
      `https://entreprise.data.gouv.fr/api/sirene/v3/unites_legales/${encodeURI(
        //@ts-ignore
        etablissement.siren
      )}`
    );

    const uniteLegale = await uniteLegaleRequest.json();

    return {
      props: {
        etablissement: etablissement,
        uniteLegale: uniteLegale.unite_legale,
      },
    };
  }
};

export default About;
