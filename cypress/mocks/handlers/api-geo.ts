import { HttpResponse, type HttpResponseResolver } from "msw";

export const apiGeoCommunesHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json({});

export const apiGeoDepartementsHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json({});

export const apiGeoRegionsHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json({});

export const apiGeoEpcisHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json({});
