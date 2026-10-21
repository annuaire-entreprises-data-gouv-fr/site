import { HttpResponse, type HttpResponseResolver } from "msw/http";
import aidesMinimis from "../../fixtures/aides-minimis.json" with {
  type: "json",
};

export const minimisHandler: HttpResponseResolver = () =>
  HttpResponse.json(aidesMinimis);
