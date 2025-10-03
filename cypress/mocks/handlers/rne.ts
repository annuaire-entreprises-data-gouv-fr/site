import { HttpResponse, type HttpResponseResolver } from "msw";

export const rneDefaultHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json({});
};

export const rneFallbackHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json({});
};
