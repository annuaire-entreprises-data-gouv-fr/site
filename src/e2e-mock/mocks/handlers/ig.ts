import { HttpResponse, type HttpResponseResolver } from "msw/http";

export const igHandler: HttpResponseResolver = ({ request: _request }) =>
  HttpResponse.json({});
