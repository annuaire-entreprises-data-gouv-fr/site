import { HttpResponse, type HttpResponseResolver } from "msw";
import apiSireneInseeAuth from "../../fixtures/api-sirene-insee-auth.json";
import apiSireneInseeSiren from "../../fixtures/api-sirene-insee-siren.json";

export const apiSireneInseeSirenHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(apiSireneInseeSiren);

export const apiSireneInseeSiretHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(apiSireneInseeSiren);

export const apiSireneInseeAuthHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(apiSireneInseeAuth);
