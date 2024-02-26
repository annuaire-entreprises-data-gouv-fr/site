import routes from '#clients/routes';
import { MetadataStore } from '.';

type InclusionMetadata = { id: string; name: string; parent: string };

function mapToDomainObject(response: { results: InclusionMetadata[] }) {
  return response.results.reduce((store, el) => {
    store[el.id] = el;
    return store;
  }, {} as { [kind: string]: InclusionMetadata });
}

const store = new MetadataStore<InclusionMetadata>(
  routes.certifications.entrepriseInclusive.api.metadata,
  'inclusion-metadata',
  mapToDomainObject
);

export const clientInclusionKindMetadata = async (kind: string) =>
  store.get(kind);
