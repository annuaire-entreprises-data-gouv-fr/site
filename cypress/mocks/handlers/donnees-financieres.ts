import { HttpResponse, type HttpResponseResolver } from "msw";

export const donneesFinancieresHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json({});
};
