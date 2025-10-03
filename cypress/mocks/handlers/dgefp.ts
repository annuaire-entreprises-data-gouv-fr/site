import { HttpResponse, type HttpResponseResolver } from "msw";
import dgefp from "../../fixtures/dgefp.json";

export const dgefpHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(dgefp);
};
