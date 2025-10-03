import { HttpResponse, type HttpResponseResolver } from "msw";
import apiSireneInseeAuth from "../../fixtures/api-sirene-insee-auth.json";
import apiSireneInseeSiren from "../../fixtures/api-sirene-insee-siren.json";

export const apiSireneInseeSirenHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json(apiSireneInseeSiren);
};

export const apiSireneInseeSiretHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json(apiSireneInseeSiren);
};

export const apiSireneInseeAuthHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json(apiSireneInseeAuth);
};
