import { HttpResponse, type HttpResponseResolver } from "msw";
import upDownIo from "../../fixtures/up-down-io.json";

export const upDownIoHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(upDownIo);
};
