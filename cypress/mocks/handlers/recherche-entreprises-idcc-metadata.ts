import { HttpResponse, HttpResponseResolver } from "msw";
import rechercheEntrepriseIdccMetadata from "../../fixtures/recherche-entreprise-idcc-metadata.json";

export const rechercheEntrepriseIdccMetadataHandler: HttpResponseResolver =
  async ({ request }) => {
    return HttpResponse.json(rechercheEntrepriseIdccMetadata);
  };
