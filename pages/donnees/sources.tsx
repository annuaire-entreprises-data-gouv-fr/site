import { GetStaticProps } from 'next';
import React from 'react';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { Icon } from '#components-ui/icon/wrapper';
import { Tag } from '#components-ui/tag';
import Meta from '#components/meta/meta-client';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { administrationsMetaData } from '#models/administrations';
import { IAdministrationMetaData } from '#models/administrations/types';
import { NextPageWithLayout } from 'pages/_app';

interface IProps {
  allAdministrations: IAdministrationMetaData[];
}

const DataSourcesPage: NextPageWithLayout<IProps> = ({
  allAdministrations,
}) => (
  <>
    <Meta
      title="Sources des données utilisées dans l'Annuaire des Entreprises"
      canonical="https://annuaire-entreprises.data.gouv.fr/donnees/sources"
    />
    <div className="content-container">
      <h1>Sources de données</h1>
      <p>
        L’Annuaire des Entreprises utilise les données de différentes
        administrations. Toutes les données accessibles sur le site proviennent
        d’un jeu de données librement téléchargeable sur{' '}
        <a href="https://data.gouv.fr">data.gouv.fr</a> et sont accessibles{' '}
        <a href="/donnees/api">par API</a>.
      </p>
      <p>
        Voici donc la liste des données utilisées sur l’Annuaire des Entreprises
        :
      </p>
      <strong>Sommaire</strong>
      <ol>
        {allAdministrations.map(({ dataSources, slug }) =>
          dataSources.map((source, sourceIndex) => (
            <li key={source.label + '-' + slug}>
              <a href={`#${slug}-${sourceIndex}`}>{source.label}</a>
            </li>
          ))
        )}
      </ol>
      {allAdministrations.map(
        ({ dataSources, administrationEnum, contact, slug, long, short }) =>
          dataSources.length > 0 && (
            <React.Fragment key={slug}>
              <h2 id={slug}>{long}</h2>
              {dataSources.map(
                ({ label, datagouvLink, data, apiSlug }, sourceIndex) => (
                  <Section
                    id={`${slug}-${sourceIndex}`}
                    title={label}
                    sources={[administrationEnum]}
                  >
                    <TwoColumnTable
                      body={[
                        [
                          'Données',
                          (data || []).map(({ label }) => (
                            <Tag key={label}>{label}</Tag>
                          )),
                        ],
                        [
                          'Accès au jeu de données',
                          datagouvLink ? (
                            <a
                              target="_blank"
                              rel="noreferrer noopener"
                              href={datagouvLink}
                            >
                              → Consulter la source
                            </a>
                          ) : null,
                        ],
                        [
                          'Accès par API',
                          apiSlug ? (
                            <a href={`/donnees/api#${apiSlug}`}>
                              → Consulter l’API
                            </a>
                          ) : null,
                        ],
                        ...[
                          contact
                            ? [
                                'Administration responsable',
                                <a href={contact}>
                                  <Icon slug="mail">Contacter ({short})</Icon>
                                </a>,
                              ]
                            : [],
                        ],
                      ]}
                    />
                  </Section>
                )
              )}
              <HorizontalSeparator />
            </React.Fragment>
          )
      )}
    </div>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { allAdministrations: Object.values(administrationsMetaData) },
  };
};

export default DataSourcesPage;
