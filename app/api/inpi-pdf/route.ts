import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const siren = searchParams.get('siren');

  if (!siren) {
    return NextResponse.json(
      { message: 'Un SIREN est requis' },
      { status: 400 }
    );
  }

  try {
    const pdfUrl = `${routes.rne.portail.pdf}?format=pdf&ids=[%22${siren}%22]`;

    const response = await fetch(pdfUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      logErrorInSentry(
        new FetchRessourceException({
          cause: response,
          ressource: 'Extrait RNE',
          administration: EAdministration.INPI,
        })
      );
      return NextResponse.json(
        { message: 'Une erreur est intervenue. Nos équipes ont été notifiés.' },
        { status: response.status }
      );
    }

    const blob = await response.blob();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="extrait_immatriculation_inpi_${siren}.pdf"`,
      },
    });
  } catch (error) {
    logErrorInSentry(
      new FetchRessourceException({
        cause: error,
        ressource: 'Extrait RNE',
        administration: EAdministration.INPI,
      })
    );

    return NextResponse.json(
      {
        message: 'Une erreur est intervenue. Nos équipes ont été notifiés.',
      },
      { status: 500 }
    );
  }
}
