import { HttpResponse, type HttpResponseResolver } from "msw";
import effectifs from "../../fixtures/rcd-effectifs-mensuels.json" with {
  type: "json",
};

export const effectifsMensuelsHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(effectifs);
