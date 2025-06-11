import { SireneSearchParams } from '#clients/sirene-insee/export-csv';
import { Exception } from '#models/exceptions';
import { getEtablissementListe } from '#models/sirene-fr';
import { logErrorInSentry } from '#utils/sentry';
import { NextRequest } from 'next/server';

async function exportCsv(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const searchParams = body as SireneSearchParams;

    const csvData = await getEtablissementListe(searchParams);

    if (typeof csvData === 'string') {
      return new Response(csvData, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition':
            'attachment; filename="annuaire-etablissements.csv"',
        },
      });
    } else {
      return Response.json(csvData);
    }
  } catch (e) {
    logErrorInSentry(new Exception({ name: 'Export CSV', cause: e }));
    return Response.json(e);
  }
}

export const POST = exportCsv;
