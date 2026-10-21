import { HttpResponse, type HttpResponseResolver } from "msw/http";
import apiBio from "../../fixtures/api-bio.json" with { type: "json" };

export const apiBioHandler: HttpResponseResolver = ({ request: _request }) =>
  HttpResponse.json(apiBio);
