import { HttpResponse, type HttpResponseResolver } from "msw";

export const associationHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json({});
