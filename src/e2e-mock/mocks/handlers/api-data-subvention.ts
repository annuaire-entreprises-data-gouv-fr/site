import { HttpResponse, type HttpResponseResolver } from "msw";
import apiDataSubvention from "../../fixtures/api-data-subvention.json" with {
  type: "json",
};

export const apiDataSubventionHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(apiDataSubvention);
