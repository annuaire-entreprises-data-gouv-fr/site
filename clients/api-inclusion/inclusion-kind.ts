import routes from '#clients/routes';
import { DataStore } from '#utils/data-store';
import { httpGet } from '#utils/network';

type InclusionMetadata = { id: string; name: string; parent: string };

function mapToDomainObject(response: { results: InclusionMetadata[] }) {
  return response.results.reduce((store, el) => {
    store.set(el.id, el);
    return store;
  }, new Map() as Map<string, InclusionMetadata>);
}

const store = new DataStore<InclusionMetadata>(
  () => httpGet(routes.certifications.entrepriseInclusive.api.metadata),
  'inclusion-metadata',
  mapToDomainObject
);

export const clientInclusionKindMetadata = async (kind: string) =>
  store.get(kind);
