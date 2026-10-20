import { HttpResponse, type HttpResponseResolver } from "msw/http";
import mandatairesRcs from "../../fixtures/mandataires-rcs.json" with {
  type: "json",
};

export const mandatairesRcsHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(mandatairesRcs);
