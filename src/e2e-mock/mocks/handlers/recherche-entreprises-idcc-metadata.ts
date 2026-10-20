import { HttpResponse, type HttpResponseResolver } from "msw/http";
import rechercheEntrepriseIdccMetadata from "../../fixtures/recherche-entreprise-idcc-metadata.json" with {
  type: "json",
};

export const rechercheEntrepriseIdccMetadataHandler: HttpResponseResolver =
  async ({ request: _request }) =>
    HttpResponse.json(rechercheEntrepriseIdccMetadata);
