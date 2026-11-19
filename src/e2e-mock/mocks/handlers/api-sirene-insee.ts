import { HttpResponse, type HttpResponseResolver } from "msw/http";
import apiSireneInseeAuth from "../../fixtures/api-sirene-insee-auth.json" with {
  type: "json",
};
import apiSireneInseeSiren from "../../fixtures/api-sirene-insee-siren.json" with {
  type: "json",
};

import { strictSiren } from "../../fixtures/diffusion";

export const apiSireneInseeSirenHandler: HttpResponseResolver = ({
  request,
}) =>
  new URL(request.url).pathname.endsWith(`/${strictSiren}`)
    ? new HttpResponse(null, { status: 403 })
    : HttpResponse.json(apiSireneInseeSiren);

export const apiSireneInseeSiretHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(apiSireneInseeSiren);

export const apiSireneInseeAuthHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(apiSireneInseeAuth);
