import { HttpResponse, type HttpResponseResolver } from "msw";
import baseAdresseNationale from "../../fixtures/base-adresse-nationale.json" with {
  type: "json",
};

export const baseAdresseNationaleHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(baseAdresseNationale);
