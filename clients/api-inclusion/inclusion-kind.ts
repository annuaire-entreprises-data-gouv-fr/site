import routes from '#clients/routes';
import constants from '#models/constants';
import { DataStore } from '#utils/data-store';
import { httpGet } from '#utils/network';

type InclusionMetadata = { id: string; name: string; parent: string };

function mapToDomainObject(response: { results: InclusionMetadata[] }) {
  return response.results.reduce((store, el) => {
    store[el.id] = el;
    return store;
  }, {} as { [key: string]: InclusionMetadata });
}

const store = new DataStore<InclusionMetadata>(
  () =>
    httpGet(routes.certifications.entrepriseInclusive.api.metadata, {
      headers: {
        Authorization: `Bearer ${process.env.API_MARCHE_INCLUSION_TOKEN}`,
      },
      timeout: constants.timeout.XXXL,
    }),
  'inclusion-metadata',
  mapToDomainObject
);

export const clientInclusionKindMetadata = async (kind: string) =>
  store.get(kind);
