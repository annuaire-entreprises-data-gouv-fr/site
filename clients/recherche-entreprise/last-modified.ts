import routes from '#clients/routes';
import { DataStore } from '../store';

const store = new DataStore<string>(
  routes.rechercheEntreprise.lastModified,
  'recherche-entreprise-last-modified',
  (response) => response
);

/**
 * Returns the dates of last modification of the data sources used in recherche entreprise
 *
 * For instance :
 * IDCC was published on 29/11, we indexed it on 12/12, then last modified date is 29/11
 */
export const clientRechercheEntrepriseLastModified = async () => {
  return {
    rne: (await store.get('rne')) ?? null,
    idcc: (await store.get('convention_collective')) ?? null,
  };
};