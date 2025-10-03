import { HttpResponse, type HttpResponseResolver } from "msw";

export const apiGeoCommunesHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json({});

export const apiGeoDepartementsHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json({});

export const apiGeoRegionsHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json({});

export const apiGeoEpcisHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json({});
