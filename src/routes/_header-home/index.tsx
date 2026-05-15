import { createFileRoute } from "@tanstack/react-router";
import Favourites from "#/components/favourites";
import { Link } from "#/components/Link";
import SearchBar from "#/components/search-bar";
import { LogoAnnuaireWithEasterEgg } from "#/components-ui/logo-annuaire/logo-with-easter-egg";
import { meta } from "#/seo";
import { HeaderHomeError } from "./-error";

export const Route = createFileRoute("/_header-home/")({
  head: () => {
    const canonical = "https://annuaire-entreprises.data.gouv.fr";

    return {
      meta: meta({
        title:
          "L’Annuaire des Entreprises françaises : les informations légales officielles de l’administration",
        description:
          "L’administration permet aux particuliers, entrepreneurs et agents publics de vérifier les informations informations légales des entreprises, associations et services publics en France.",
        robots: "index, follow",
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
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://annuaire-entreprises.data.gouv.fr",
            potentialAction: [
              {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://annuaire-entreprises.data.gouv.fr/rechercher?terme={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
              {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://annuaire-entreprises.data.gouv.fr/rechercher/carte?terme={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            ],
          }),
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderHomeError,
});

function RouteComponent() {
  return (
    <>
      <div className="layout-center">
        <form
          action={"/rechercher"}
          id="search-bar-form"
          method="get"
          style={{
            marginBottom: "16vh",
            marginTop: "11vh",
            maxWidth: "900px",
          }}
        >
          <LogoAnnuaireWithEasterEgg />
          <h2 style={{ textAlign: "center", marginTop: "30px" }}>
            Vérifiez les informations légales publiques des entreprises,
            associations et services publics en France
          </h2>
          <div
            style={{
              margin: "auto",
              marginTop: "30px",
              flexDirection: "column",
              width: "100%",
              maxWidth: "450px",
            }}
          >
            <SearchBar
              autoFocus={true}
              defaultValue=""
              placeholder="Nom, adresse, n° SIRET/SIREN..."
            />
          </div>

          <br />
          <div className="layout-center">
            <Link to="/rechercher">→ Effectuer une recherche avancée</Link>
          </div>
        </form>
      </div>
      <div style={{ height: "25vh", maxHeight: "150px" }}>
        <Favourites />
      </div>
    </>
  );
}
