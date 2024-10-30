import { APISlugNotFound, pingAPIClient } from '#clients/ping-api-clients';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { test, status = 500 } = await pingAPIClient(slug || '');

    if (test) {
      return new Response(JSON.stringify({ message: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'ko', status }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (e: any) {
    if (e instanceof APISlugNotFound) {
      return new Response(JSON.stringify(e), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify(e), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
