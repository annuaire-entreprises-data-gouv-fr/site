import { HttpResponse, HttpResponseResolver } from "msw";
import bodacc from "../../fixtures/bodacc.json";

export const bodaccHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(bodacc);
};
