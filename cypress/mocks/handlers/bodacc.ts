import { HttpResponse, type HttpResponseResolver } from "msw";
import bodacc from "../../fixtures/bodacc.json" with { type: "json" };

export const bodaccHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(bodacc);
