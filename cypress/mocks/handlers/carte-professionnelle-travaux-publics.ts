import { HttpResponse, type HttpResponseResolver } from "msw";
import carteProfessionnelleTravauxPublics from "../../fixtures/carte-professionnelle-travaux-publics.json" with {
  type: "json",
};

export const carteProfessionnelleTravauxPublicsHandler: HttpResponseResolver =
  ({ request: _request }) =>
    HttpResponse.json(carteProfessionnelleTravauxPublics);
