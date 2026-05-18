import { HttpResponse, type HttpResponseResolver } from "msw";

export const igHandler: HttpResponseResolver = ({ request: _request }) =>
  HttpResponse.json({});
