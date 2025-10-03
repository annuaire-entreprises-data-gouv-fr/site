import { HttpResponse, type HttpResponseResolver } from "msw";
import mandatairesRcs from "../../fixtures/mandataires-rcs.json";

export const mandatairesRcsHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(mandatairesRcs);
