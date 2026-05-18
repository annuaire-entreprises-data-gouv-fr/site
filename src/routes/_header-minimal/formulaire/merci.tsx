import { createFileRoute } from "@tanstack/react-router";
import ButtonLink from "#/components-ui/button";
import { meta } from "#/utils/seo";

export const Route = createFileRoute("/_header-minimal/formulaire/merci")({
  head: () => {
    const canonical =
      "https://annuaire-entreprises.data.gouv.fr/formulaire/merci";
    return {
      meta: meta({
        title: "Merci beaucoup pour votre retour",
        robots: "noindex, nofollow",
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
});

function RouteComponent() {
  return (
    <div id="layout">
      <main>
        <div className="layout-center">
          <h1>Merci beaucoup pour votre retour 🙂 !</h1>
        </div>
        <br />
        <div className="layout-center">
          <ButtonLink to="/">Retourner au moteur de recherche</ButtonLink>
        </div>
      </main>
    </div>
  );
}
