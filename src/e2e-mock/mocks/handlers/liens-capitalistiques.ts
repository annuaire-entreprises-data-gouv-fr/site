import { HttpResponse, type HttpResponseResolver } from "msw/http";
import liensCapitalistiques from "../../fixtures/dgfip-liens-capitalistiques.json" with {
  type: "json",
};

export const liensCapitalistiquesHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(liensCapitalistiques);
