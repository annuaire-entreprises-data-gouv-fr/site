import { SireneSearchParams } from '#clients/sirene-fr';
import { getEtablissementListe } from '#models/sirene-fr';
import { NextRequest } from 'next/server';
import { withHandleError } from '../data-fetching/utils';

async function exportCsv(request: NextRequest): Promise<Response> {
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
}

export const POST = withHandleError(exportCsv);
