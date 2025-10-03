import { APISlugNotFound, pingAPIClient } from "#clients/ping-api-clients";
import logErrorInSentry from "#utils/sentry";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { test, status = 500 } = await pingAPIClient(slug || "");

    if (test) {
      return new Response(JSON.stringify({ message: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ message: "ko", status }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    if (e instanceof APISlugNotFound) {
      return new Response(
        JSON.stringify({ message: "API slug not found", status: 404 }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    logErrorInSentry(e);
    return new Response(
      JSON.stringify({ message: "server error", status: 500 }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
