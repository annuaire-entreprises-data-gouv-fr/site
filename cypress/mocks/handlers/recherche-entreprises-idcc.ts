import { HttpResponse, type HttpResponseResolver } from "msw";
import rechercheEntrepriseIdcc from "../../fixtures/recherche-entreprise-idcc.json";

export const rechercheEntrepriseIdccHandler: HttpResponseResolver = async ({
  request,
}) => HttpResponse.json(rechercheEntrepriseIdcc);
