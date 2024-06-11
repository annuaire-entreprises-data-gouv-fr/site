import { IGeoElement } from '#clients/geo';
import { clientCommuneByCp, clientCommunesByName } from '#clients/geo/communes';
import {
  clientDepartementByCode,
  clientDepartementsByName,
} from '#clients/geo/departements';
import { clientEpcisByName, clientEpcisBySiren } from '#clients/geo/epcis';
import { clientRegionsByName } from '#clients/geo/regions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';

type GeoSearchResults = Array<IGeoElement>;

export async function searchGeoElementByText(
  slug: string
): Promise<GeoSearchResults | IAPINotRespondingError> {
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
      return suggests;
    }

    // code epci are siren
    if (term.length === 9) {
      const suggests = await clientEpcisBySiren(term);
      return suggests;
    }

    return APINotRespondingFactory(EAdministration.DINUM, 404);
  } else {
    const [departements, communes, regions, epcis] = await Promise.all([
      clientDepartementsByName(term),
      clientCommunesByName(term),
      clientRegionsByName(term),
      clientEpcisByName(term),
    ]);
    return [
      ...regions,
      ...departements.slice(0, 5),
      ...epcis.slice(0, 3),
      ...communes.slice(0, 20),
    ];
  }
}
