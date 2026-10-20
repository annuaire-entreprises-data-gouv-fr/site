import { HttpResponse, type HttpResponseResolver } from "msw/http";
import bodacc from "../../fixtures/bodacc.json" with { type: "json" };

export const bodaccHandler: HttpResponseResolver = ({ request: _request }) =>
  HttpResponse.json(bodacc);
