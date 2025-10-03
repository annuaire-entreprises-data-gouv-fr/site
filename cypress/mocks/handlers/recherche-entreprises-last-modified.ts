import { HttpResponse, type HttpResponseResolver } from "msw";
import rechercheEntrepriseLastModified from "../../fixtures/recherche-entreprise-last-modified.json";

export const rechercheEntrepriseLastModifiedHandler: HttpResponseResolver =
  async ({ request }) => HttpResponse.json(rechercheEntrepriseLastModified);
