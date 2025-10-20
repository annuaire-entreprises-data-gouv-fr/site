import { HttpResponse, type HttpResponseResolver } from "msw";

export const rneDefaultHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json({});

export const rneObservationsFallbackHandler: HttpResponseResolver = ({
  request,
}) => HttpResponse.json([]);
