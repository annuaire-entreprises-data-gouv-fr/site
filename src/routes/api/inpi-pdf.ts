import { createFileRoute } from "@tanstack/react-router";
import routes from "#/clients/routes";
import { EAdministration } from "#/models/administrations/EAdministration";
import { FetchRessourceException } from "#/models/exceptions";
import logErrorInSentry from "#/utils/sentry";
import { defaultHeadersMiddleware } from "./-middlewares";

export const Route = createFileRoute("/api/inpi-pdf")({
  server: {
    middleware: [defaultHeadersMiddleware()],
    handlers: {
      GET: async ({ request }) => {
        const searchParams = new URL(request.url).searchParams;
        const siren = searchParams.get("siren");

        try {
          const pdfUrl = `${routes.rne.portail.pdf}?format=pdf&ids=[%22${siren}%22]`;

          const response = await fetch(pdfUrl, {
            method: "GET",
          });

          const blob = await response.blob();

          return new Response(blob, {
            status: response.status || 200,
            headers: {
              "Content-Type":
                response.headers.get("Content-Type") || "application/pdf",
              "Content-Length":
                response.headers.get("Content-Length") || blob.size.toString(),
              "Content-Disposition":
                response.headers.get("Content-Disposition") ||
                `attachment; filename="extrait_rne_${siren}.pdf"`,
            },
          });
        } catch (error) {
          logErrorInSentry(
            new FetchRessourceException({
              cause: error,
              ressource: "Extrait RNE",
              administration: EAdministration.INPI,
            })
          );
          return Response.json(
            {
              message:
                "Une erreur est intervenue. Nos équipes ont été notifiés.",
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
