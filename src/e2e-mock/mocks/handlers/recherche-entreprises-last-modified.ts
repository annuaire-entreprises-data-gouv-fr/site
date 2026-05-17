import { HttpResponse, type HttpResponseResolver } from "msw";
import rechercheEntrepriseLastModified from "../../fixtures/recherche-entreprise-last-modified.json" with {
  type: "json",
};

export const rechercheEntrepriseLastModifiedHandler: HttpResponseResolver =
  async ({ request: _request }) =>
    HttpResponse.json(rechercheEntrepriseLastModified);
