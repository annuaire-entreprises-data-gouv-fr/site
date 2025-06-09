import { SireneSearchParams } from '#clients/sirene-fr';
import { getEtablissementListeCount } from '#models/sirene-fr';
import { NextRequest } from 'next/server';
import { withHandleError } from '../data-fetching/utils';

async function exportCsvCount(request: NextRequest): Promise<Response> {
  const body = await request.json();
  const searchParams = body as SireneSearchParams;

  const response = await getEtablissementListeCount(searchParams);

  if (typeof response === 'number') {
    return Response.json({ count: response });
  } else {
    return Response.json(response);
  }
}

export const POST = withHandleError(exportCsvCount);
