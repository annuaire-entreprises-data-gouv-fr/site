import { HttpResponse, type HttpResponseResolver } from "msw";
import liensCapitalistiques from "../../fixtures/dgfip-liens-capitalistiques.json" with {
  type: "json",
};

export const liensCapitalistiquesHandler: HttpResponseResolver = ({
  request,
}) => HttpResponse.json(liensCapitalistiques);
