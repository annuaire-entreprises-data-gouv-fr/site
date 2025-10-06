import { HttpResponse, type HttpResponseResolver } from "msw";
import upDownIo from "../../fixtures/up-down-io.json" with { type: "json" };

export const upDownIoHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(upDownIo);
