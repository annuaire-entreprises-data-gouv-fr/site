import { HttpResponse, type HttpResponseResolver } from "msw";

export const rneDefaultHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json({});

export const rneFallbackHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json({});
