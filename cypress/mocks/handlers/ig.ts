import { HttpResponse, type HttpResponseResolver } from "msw";

export const igHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json({});
