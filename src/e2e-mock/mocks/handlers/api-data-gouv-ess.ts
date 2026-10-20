import { HttpResponse, type HttpResponseResolver } from "msw/http";
import apiDataGouvEss from "../../fixtures/api-data-gouv-ess.json" with {
  type: "json",
};

export const apiDataGouvEssHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(apiDataGouvEss);
