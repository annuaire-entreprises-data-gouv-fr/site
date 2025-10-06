import { HttpResponse, type HttpResponseResolver } from "msw";
import dgefp from "../../fixtures/dgefp.json" with { type: "json" };

export const dgefpHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(dgefp);
