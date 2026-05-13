import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Fragment } from "react";
import ApiMonitoring from "#/components/api-monitoring";
import { Link } from "#/components/Link";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import { administrationsMetaData } from "#/models/administrations";
import { getMonitorsByAdministration } from "#/models/monitoring";
import { meta } from "#/seo";
import { HeaderPublicError } from "./-error";

const fetchMonitorsFn = createServerFn().handler(async () => {
  const monitors = await getMonitorsByAdministration();
  return {
    monitors,
    administrationsMetaData,
  };
});

export const Route = createFileRoute("/_header-public/donnees/api")({
  loader: async () => await fetchMonitorsFn(),
  head: () => {
    const canonical = "https://annuaire-entreprises.data.gouv.fr/donnees/api";
    return {
      meta: meta({
        title: "Statut des API utilisées par l’Annuaire des Entreprises",
        robots: {
          follow: false,
        },
        alternates: {
          canonical,
        },
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderPublicError,
});

function RouteComponent() {
  const { monitors, administrationsMetaData } = Route.useLoaderData();

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // reload page every minute
            window.setTimeout(function() {window.location.reload()}, 60*1000)
        `,
        }}
      />
      <div className="content-container">
        <h1>Statut des API utilisées</h1>
        <p>
          L’Annuaire des Entreprises utilise les données de différentes
          administrations en lien avec les entreprises, les associations et les
          services publics. Les <Link to="/donnees/sources">données</Link> sont
          accessibles par le biais de téléservices appelés API. Ces API sont{" "}
          <strong>ouvertes à tous</strong>.
        </p>
        <p>
          Cette page détaille la liste des API utilisées et leur disponibilité
          en temps réel&nbsp;:
        </p>
        <strong>Sommaire</strong>
        <ol>
          {Object.keys(monitors).map((administrationEnum) =>
            monitors[administrationEnum].map((monitor) => (
              <li key={monitor.apiSlug}>
                <span
                  style={{ color: monitor.isOnline ? "#3bd671" : "#f29030" }}
                >
                  ●
                </span>{" "}
                <a href={`#${monitor.apiSlug}`}>{monitor.apiName}</a>
              </li>
            ))
          )}
        </ol>
        {Object.keys(monitors).map((administrationEnum) => (
          <Fragment key={administrationEnum}>
            <h2 id={administrationsMetaData[administrationEnum]?.slug}>
              {administrationsMetaData[administrationEnum]?.long}
            </h2>
            {monitors[administrationEnum].map((monitor) => (
              <Fragment key={monitor.apiName}>
                <h3 id={monitor.apiSlug}>{monitor.apiName}</h3>
                <ApiMonitoring {...monitor} />
              </Fragment>
            ))}
            <HorizontalSeparator />
          </Fragment>
        ))}
      </div>
    </>
  );
}
