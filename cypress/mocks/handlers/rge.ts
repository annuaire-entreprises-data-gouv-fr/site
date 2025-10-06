import { HttpResponse, type HttpResponseResolver } from "msw";
import rge from "../../fixtures/rge.json" with { type: "json" };

export const rgeHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(rge);
