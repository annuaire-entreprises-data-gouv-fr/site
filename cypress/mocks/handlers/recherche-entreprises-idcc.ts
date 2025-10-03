import { HttpResponse, type HttpResponseResolver } from "msw";
import rechercheEntrepriseIdcc from "../../fixtures/recherche-entreprise-idcc.json";

export const rechercheEntrepriseIdccHandler: HttpResponseResolver = async ({
  request,
}) => {
  return HttpResponse.json(rechercheEntrepriseIdcc);
};
