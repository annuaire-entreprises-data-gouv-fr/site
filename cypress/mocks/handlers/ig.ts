import { HttpResponse, type HttpResponseResolver } from "msw";

export const igHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json({});
};
