import { HttpResponse, HttpResponseResolver } from "msw";
import apiDataSubvention from "../../fixtures/api-data-subvention.json";

export const apiDataSubventionHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(apiDataSubvention);
};
