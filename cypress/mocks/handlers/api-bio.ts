import { HttpResponse, type HttpResponseResolver } from "msw";
import apiBio from "../../fixtures/api-bio.json" with { type: "json" };

export const apiBioHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(apiBio);
