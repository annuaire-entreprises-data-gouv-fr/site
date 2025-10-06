import { HttpResponse, type HttpResponseResolver } from "msw";
import rechercheEntrepriseIdccMetadata from "../../fixtures/recherche-entreprise-idcc-metadata.json" with {
  type: "json",
};

export const rechercheEntrepriseIdccMetadataHandler: HttpResponseResolver =
  async ({ request }) => HttpResponse.json(rechercheEntrepriseIdccMetadata);
