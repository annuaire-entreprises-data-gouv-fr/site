import { HttpResponse, type HttpResponseResolver } from "msw/http";
import dgefp from "../../fixtures/dgefp.json" with { type: "json" };

export const dgefpHandler: HttpResponseResolver = ({ request: _request }) =>
  HttpResponse.json(dgefp);
