import { HttpResponse, type HttpResponseResolver } from "msw";
import entrepreneurSpectacles from "../../fixtures/entrepreneur-spectacles.json" with {
  type: "json",
};

export const entrepreneurSpectaclesHandler: HttpResponseResolver = ({
  request,
}) => HttpResponse.json(entrepreneurSpectacles);
