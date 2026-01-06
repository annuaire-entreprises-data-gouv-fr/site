import type { Metadata } from "next";
import React from "react";
import { Link } from "#components/Link";
import { Section } from "#components/section";
import { TwoColumnTable } from "#components/table/simple";
import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import { Icon } from "#components-ui/icon/wrapper";
import { Tag } from "#components-ui/tag";
import { administrationsMetaData, allAPI } from "#models/administrations";
import constants from "#models/constants";

export const metadata: Metadata = {
  title: "Sources des données utilisées dans l’Annuaire des Entreprises",
  alternates: {
    canonical: "https://annuaire-entreprises.data.gouv.fr/donnees/sources",
  },
};

export default function DataSourcesPage() {
  const allAdministrations = Object.values(administrationsMetaData).filter(
    (administration) => administration.dataSources.length > 0
  );

  return (
    <div className="content-container">
      <h1>Sources de données</h1>
      <p>
        L’Annuaire des Entreprises utilise les données de différentes
        administrations. Toutes les données accessibles sur le site proviennent
        d’un jeu de données librement téléchargeable sur{" "}
        <a href="https://data.gouv.fr">data.gouv.fr</a> et sont accessibles{" "}
        <Link href="/donnees/api">par API</Link>.
      </p>
      <p>
        Voici donc la liste des données utilisées sur l’Annuaire des Entreprises
        :
      </p>
      <strong>Sommaire</strong>
      <ol>
        {allAdministrations.map(({ dataSources, slug }) =>
          dataSources.map((source, sourceIndex) => {
            const api = allAPI[source.apiSlug];
            const isProtected = api?.isProtected;

            return (
              <li key={`${source.label}-${slug}`}>
                <a
                  href={`#${slug}-${sourceIndex}`}
                  style={{
                    display: "inline-block",
                  }}
                >
                  <span>
                    {isProtected ? (
                      <Icon
                        color={constants.colors.espaceAgent}
                        slug="lockFill"
                      >
                        {source.label}
                      </Icon>
                    ) : (
                      source.label
                    )}
                  </span>
                </a>
              </li>
            );
          })
        )}
      </ol>
      {allAdministrations.map(
        ({ dataSources, administrationEnum, contact, slug, long, short }) => (
          <React.Fragment key={slug}>
            <h2 id={slug}>{long}</h2>
            {dataSources.map(
              ({ label, datagouvLink, data, apiSlug }, sourceIndex) => {
                const api = allAPI[apiSlug];
                const isProtected = api?.isProtected;

                return (
                  <Section
                    id={`${slug}-${sourceIndex}`}
                    isProtected={isProtected}
                    key={label}
                    sources={[administrationEnum]}
                    title={label}
                  >
                    <TwoColumnTable
                      body={[
                        [
                          "Données",
                          (data || []).map(({ label }) => (
                            <Tag key={label}>{label}</Tag>
                          )),
                        ],
                        ...(isProtected
                          ? []
                          : [
                              [
                                "Source de données",
                                datagouvLink ? (
                                  <a
                                    href={datagouvLink}
                                    rel="noreferrer noopener"
                                    target="_blank"
                                  >
                                    Consulter le jeu de données
                                  </a>
                                ) : (
                                  <i>
                                    Non renseigné ou non publié sur data.gouv.fr
                                  </i>
                                ),
                              ],
                            ]),
                        ...(api
                          ? [
                              [
                                "API utilisée",
                                <>
                                  <strong>{api.apiName}</strong>
                                  {api.apiDocumentationLink && (
                                    <>
                                      {" ("}
                                      <a
                                        href={api.apiDocumentationLink}
                                        rel="noreferrer noopener"
                                        target="_blank"
                                      >
                                        documentation
                                      </a>
                                      )
                                    </>
                                  )}
                                </>,
                              ],
                            ]
                          : []),
                        ...(api && api.updownIoId
                          ? [
                              [
                                "Taux de disponibilité de l'API",
                                <Link
                                  href={`/donnees/api#${api.apiSlug}`}
                                  rel="noreferrer noopener"
                                  target="_blank"
                                >
                                  Consulter le taux de disponibilité
                                </Link>,
                              ],
                            ]
                          : []),
                        ...(contact
                          ? [
                              [
                                "Administration responsable",
                                <a href={contact}>
                                  <Icon slug="mail">Contacter ({short})</Icon>
                                </a>,
                              ],
                            ]
                          : []),
                      ]}
                    />
                  </Section>
                );
              }
            )}
            <HorizontalSeparator />
          </React.Fragment>
        )
      )}
    </div>
  );
}
