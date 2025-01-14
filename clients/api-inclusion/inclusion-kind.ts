import { DataStore } from '#clients/data-store';
import routes from '#clients/routes';
import { httpGet } from '#utils/network';

type InclusionMetadata = { id: string; name: string; parent: string };

function mapToDomainObject(response: { results: InclusionMetadata[] }) {
  return response.results.reduce((store, el) => {
    store[el.id] = el;
    return store;
  }, {} as { [kind: string]: InclusionMetadata });
}

const store = new DataStore<InclusionMetadata>(
  () => httpGet(routes.certifications.entrepriseInclusive.api.metadata),
  'inclusion-metadata',
  mapToDomainObject
);

export const clientInclusionKindMetadata = async (kind: string) =>
  store.get(kind);
