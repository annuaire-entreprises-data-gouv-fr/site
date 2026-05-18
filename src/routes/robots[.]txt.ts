import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const shouldNotIndex = process.env.INDEXING_ENABLED !== "enabled";

        let robots = "";

        if (shouldNotIndex) {
          robots = `User-agent: *
Disallow: /`;
        } else {
          robots = `User-agent: *
Allow: /
Allow: /entreprise/
Allow: /administration/
Allow: /faq/
Allow: /definitions/
Allow: /departements/
Allow: /etablissement/
Allow: /lp/
Allow: /documents/
Allow: /donnees-financieres/
Allow: /annonces/
Allow: /labels-certificats/
Allow: /justificatif-immatriculation-pdf/
Allow: /rechercher/carte
Allow: /rechercher/
Allow: /dirigeants/
Allow: /personne/
Allow: /divers/
Allow: /erreur/
Allow: /formulaire/
Disallow: /api/
Disallow: /admin/

Sitemap: https://annuaire-entreprises.data.gouv.fr/sitemap.xml`;
        }
        return new Response(robots, {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      },
    },
  },
});
