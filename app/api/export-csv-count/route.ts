import { SireneSearchParams } from '#clients/sirene-fr';
import { getEtablissementListeCount } from '#models/sirene-fr';
import { NextRequest } from 'next/server';
import { withHandleError } from '../data-fetching/utils';

async function exportCsvCount(request: NextRequest): Promise<Response> {
  const body = await request.json();
  const searchParams = body as SireneSearchParams;

  const count = await getEtablissementListeCount(searchParams);

  return Response.json({ count });
}

export const POST = withHandleError(exportCsvCount);
