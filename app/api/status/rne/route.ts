import { clientDocuments } from '#clients/api-rne/documents';
import { verifySiren } from '#utils/helpers/siren-and-siret';

export async function GET() {
  try {
    const dummySiren = verifySiren('552032534');

    // uses actes for monitoring as they are rarely rate limited
    await clientDocuments(dummySiren);
    return new Response(JSON.stringify({ message: 'ok', status: 200 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    const status = e.status || 500;
    return new Response(JSON.stringify({ message: 'ko', status }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
