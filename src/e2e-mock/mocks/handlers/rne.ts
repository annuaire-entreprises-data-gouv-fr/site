import { HttpResponse, type HttpResponseResolver } from "msw/http";

export const rneDefaultHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json({});

export const rneObservationsFallbackHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json([]);
