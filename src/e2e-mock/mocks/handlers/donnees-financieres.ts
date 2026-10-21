import { HttpResponse, type HttpResponseResolver } from "msw/http";

export const donneesFinancieresHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json({});
