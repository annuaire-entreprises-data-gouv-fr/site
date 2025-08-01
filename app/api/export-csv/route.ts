import { Exception } from '#models/exceptions';
import {
  getEtablissementListe,
  getEtablissementListeCount,
} from '#models/sirene-fr';
import { logErrorInSentry } from '#utils/sentry';
import { NextRequest } from 'next/server';
import z from 'zod';
import { exportCsvSchema } from './input-validation';

class APIResponseError extends Error {
  constructor(message: string, public data: any) {
    super(message);
    this.name = 'APIResponseError';
  }
}

async function exportCsv(request: NextRequest): Promise<Response> {
  if (process.env.EXPORT_CSV_ENABLED !== 'enabled') {
    return Response.json(
      {
        error: 'Export CSV is not enabled',
      },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = exportCsvSchema.parse(body);

    const response = await getEtablissementListeCount(validatedData);

    if (validatedData.count && typeof response === 'number') {
      return Response.json({ count: response });
    } else {
      if (typeof response !== 'number') {
        throw new APIResponseError('Count export CSV request failed', response);
      } else if (response > 200000) {
        throw new Error('Response is not a number or is greater than 200000');
      }

      const csvData = await getEtablissementListe(validatedData);

      if (typeof csvData !== 'string') {
        throw new APIResponseError('Export CSV request failed', response);
      }

      return new Response(csvData, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition':
            'attachment; filename="annuaire-etablissements.csv"',
        },
      });
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
    if (e instanceof APIResponseError) {
      logErrorInSentry(
        new Exception({
          name: 'API Sirene INSEE Export CSV',
          cause: e,
        })
      );
      return Response.json(
        {
          error: 'Internal server error',
        },
        { status: 500 }
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
