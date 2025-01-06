import { HttpResponse, HttpResponseResolver } from 'msw';
import rechercheEntrepriseLastModified from '../../fixtures/recherche-entreprise-last-modified.json';

export const rechercheEntrepriseLastModifiedHandler: HttpResponseResolver =
  async ({ request }) => {
    return HttpResponse.json(rechercheEntrepriseLastModified);
  };
