import { HttpResponse, HttpResponseResolver } from "msw";
import rge from "../../fixtures/rge.json";

export const rgeHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(rge);
};
