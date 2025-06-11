import { SireneSearchParams } from '#clients/sirene-insee/export-csv';
import { Exception } from '#models/exceptions';
import { getEtablissementListeCount } from '#models/sirene-fr';
import { logErrorInSentry } from '#utils/sentry';
import { NextRequest } from 'next/server';

async function exportCsvCount(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const searchParams = body as SireneSearchParams;

    const response = await getEtablissementListeCount(searchParams);

    if (typeof response === 'number') {
      return Response.json({ count: response });
    } else {
      return Response.json(response);
    }
  } catch (e) {
    logErrorInSentry(new Exception({ name: 'Export CSV Count', cause: e }));
    return Response.json(e);
  }
}

export const POST = exportCsvCount;
