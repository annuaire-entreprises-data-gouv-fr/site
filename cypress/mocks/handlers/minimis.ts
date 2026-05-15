import { HttpResponse, type HttpResponseResolver } from "msw";
import aidesMinimis from "../../fixtures/aides-minimis.json" with {
  type: "json",
};

export const minimisHandler: HttpResponseResolver = () =>
  HttpResponse.json(aidesMinimis);
