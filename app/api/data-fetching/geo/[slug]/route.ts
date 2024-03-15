import { notFound } from 'next/navigation';
import { clientCommuneByCp, clientCommunesByName } from '#clients/geo/communes';
import {
  clientDepartementByCode,
  clientDepartementsByName,
} from '#clients/geo/departements';
import { clientEpcisByName, clientEpcisBySiren } from '#clients/geo/epcis';
import { clientRegionsByName } from '#clients/geo/regions';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  try {
    const term = slug as string;
    const isNumber = /^[0-9]+$/.test(term);
    if (isNumber) {
      if (term.length < 6) {
        // code departement or CP
        let suggests = [];
        if (term.length <= 2) {
          const testDepCode = `${term}${'0'.repeat(2 - term.length)}`;
          suggests = await clientDepartementByCode(testDepCode);
        } else {
          const testCommuneCode = `${term}${'0'.repeat(5 - term.length)}`;
          suggests = await clientCommuneByCp(testCommuneCode);
        }
        return Response.json(suggests, { status: 200 });
      }

      // code epci are siren
      if (term.length === 9) {
        const suggests = await clientEpcisBySiren(term);
        return Response.json(suggests, { status: 200 });
      }

      return notFound();
    } else {
      const [departements, communes, regions, epcis] = await Promise.all([
        clientDepartementsByName(term),
        clientCommunesByName(term),
        clientRegionsByName(term),
        clientEpcisByName(term),
      ]);
      const results = [
        ...regions,
        ...departements.slice(0, 5),
        ...epcis.slice(0, 3),
        ...communes.slice(0, 20),
      ];
      return Response.json(results, { status: 200 });
    }
  } catch (e: any) {
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'Geo',
        context: {
          slug: slug as string,
        },
      })
    );
    return Response.json(
      { message: 'failed to determine localisation' },
      { status: e.status || 500 }
    );
  }
}
