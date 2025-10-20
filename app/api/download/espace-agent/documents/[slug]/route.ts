import { NextResponse } from "next/server";
import {
  clientDownloadActe,
  clientDownloadBilan,
} from "#clients/api-rne/download";
import { HttpBadRequestError, HttpForbiddenError } from "#clients/exceptions";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import { FetchRessourceException } from "#models/exceptions";
import logErrorInSentry from "#utils/sentry";
import withSession, { type IReqWithSession } from "#utils/session/with-session";

export type IContext = { params: Promise<{ slug: string }> };

export const GET = withSession(
  async (req: IReqWithSession, context: IContext) => {
    const { slug } = await context.params;
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type");

    try {
      if (!hasRights(req.session, ApplicationRights.documentsRne)) {
        throw new HttpForbiddenError("Unauthorized account");
      }

      if (!slug) {
        throw new HttpBadRequestError("Please provide a valid acte id");
      }

      let pdfBuffer: string | ArrayBuffer;
      if (type === "bilan") {
        pdfBuffer = await clientDownloadBilan(slug);
      } else if (type === "acte") {
        pdfBuffer = await clientDownloadActe(slug);
      } else {
        throw new HttpBadRequestError("Please provide a valid document type");
      }

      // Convert to Uint8Array for streaming
      const buffer =
        typeof pdfBuffer === "string"
          ? new TextEncoder().encode(pdfBuffer)
          : new Uint8Array(pdfBuffer);

      // Convert to ReadableStream for streaming response
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(buffer);
          controller.close();
        },
      });

      return new NextResponse(stream, {
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
          context: { details: slug },
        })
      );
      return NextResponse.json({ message }, { status: e.status || 500 });
    }
  }
);
