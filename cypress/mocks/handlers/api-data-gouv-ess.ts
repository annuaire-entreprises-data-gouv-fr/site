import { HttpResponse, type HttpResponseResolver } from "msw";
import apiDataGouvEss from "../../fixtures/api-data-gouv-ess.json" with {
  type: "json",
};

export const apiDataGouvEssHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(apiDataGouvEss);
