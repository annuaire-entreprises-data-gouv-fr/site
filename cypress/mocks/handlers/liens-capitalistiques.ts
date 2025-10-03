import { HttpResponse, type HttpResponseResolver } from "msw";
import liensCapitalistiques from "../../fixtures/dgfip-liens-capitalistiques.json";

export const liensCapitalistiquesHandler: HttpResponseResolver = ({
  request,
}) => HttpResponse.json(liensCapitalistiques);
