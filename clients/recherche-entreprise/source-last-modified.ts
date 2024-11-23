import routes from '#clients/routes';
import { DataStore } from '../store';

const store = new DataStore<string>(
  routes.rechercheEntreprise.lastModified,
  'recherche-entreprise-last-modified',
  (response) => response
);

export const clientRechercheEntrepriseLastModified = async (source: string) =>
  store.get(source);
