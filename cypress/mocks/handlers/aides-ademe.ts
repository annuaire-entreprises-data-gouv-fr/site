import { HttpResponse, type HttpResponseResolver } from "msw";
import aidesADEME from "../../fixtures/aides-ademe.json" with { type: "json" };

export const aidesADEMEHandler: HttpResponseResolver = () =>
  HttpResponse.json(aidesADEME);
