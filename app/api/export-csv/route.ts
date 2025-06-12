import { Exception } from '#models/exceptions';
import {
  getEtablissementListe,
  getEtablissementListeCount,
} from '#models/sirene-fr';
import { logErrorInSentry } from '#utils/sentry';
import { NextRequest } from 'next/server';
import z from 'zod';
import { exportCsvSchema } from './input-validation';

async function exportCsv(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const validatedData = exportCsvSchema.parse(body);

    if (validatedData.count) {
      const response = await getEtablissementListeCount(validatedData);

      if (typeof response === 'number') {
        return Response.json({ count: response });
      } else {
        return Response.json(response);
      }
    } else {
      const csvData = await getEtablissementListe(validatedData);

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
  } catch (e) {
    if (e instanceof z.ZodError) {
      return Response.json(
        {
          error: 'Validation failed',
          details: e.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    logErrorInSentry(new Exception({ name: 'Export CSV', cause: e }));
    return Response.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export const POST = exportCsv;
