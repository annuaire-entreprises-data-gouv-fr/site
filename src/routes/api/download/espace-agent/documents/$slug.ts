import { createFileRoute } from "@tanstack/react-router";
import {
  clientDownloadActe,
  clientDownloadBilan,
} from "#/clients/api-rne/download";
import { HttpBadRequestError, HttpForbiddenError } from "#/clients/exceptions";
import { EAdministration } from "#/models/administrations/EAdministration";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { FetchRessourceException } from "#/models/exceptions";
import { defaultHeadersMiddleware } from "#/routes/api/-middlewares";
import logErrorInSentry from "#/utils/sentry";
import { getCurrentSession } from "#/utils/session/index.server";

export const Route = createFileRoute(
  "/api/download/espace-agent/documents/$slug"
)({
  server: {
    middleware: [
      defaultHeadersMiddleware({
        "X-Accel-Buffering": "no",
      }),
    ],
    handlers: {
      GET: async ({ request, params }) => {
        const searchParams = new URL(request.url).searchParams;
        const type = searchParams.get("type");

        try {
          const session = await getCurrentSession();

          if (!hasRights(session.data, ApplicationRights.documentsRne)) {
            throw new HttpForbiddenError("Unauthorized account");
          }

          if (!params.slug) {
            throw new HttpBadRequestError("Please provide a valid acte id");
          }

          let pdfBuffer: string | ArrayBuffer;
          if (type === "bilan") {
            pdfBuffer = await clientDownloadBilan(params.slug);
          } else if (type === "acte") {
            pdfBuffer = await clientDownloadActe(params.slug);
          } else {
            throw new HttpBadRequestError(
              "Please provide a valid document type"
            );
          }

          const buffer =
            typeof pdfBuffer === "string"
              ? new TextEncoder().encode(pdfBuffer)
              : new Uint8Array(pdfBuffer);

          const stream = new ReadableStream({
            start(controller) {
              controller.enqueue(buffer);
              controller.close();
            },
          });

          return new Response(stream, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="document-${type}.pdf"`,
            },
          });
        } catch (e: any) {
          const message = "Failed to download document";
          logErrorInSentry(
            new FetchRessourceException({
              cause: e,
              ressource: "RNEDocuments",
              message,
              administration: EAdministration.INPI,
              context: { details: params.slug },
            })
          );
          return Response.json({ message }, { status: e.status || 500 });
        }
      },
    },
  },
});
