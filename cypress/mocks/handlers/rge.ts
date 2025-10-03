import { HttpResponse, type HttpResponseResolver } from "msw";
import rge from "../../fixtures/rge.json";

export const rgeHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(rge);
