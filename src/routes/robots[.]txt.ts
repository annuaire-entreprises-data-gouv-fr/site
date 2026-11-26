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

Disallow: /api/*
Disallow: /admin/*

Disallow: /rechercher?
Disallow: /rechercher/*?
Disallow: /rechercher/carte?
Disallow: /rechercher/carte/*?
Disallow: /rechercher/fondations?
Disallow: /rechercher/fondations/*?

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
