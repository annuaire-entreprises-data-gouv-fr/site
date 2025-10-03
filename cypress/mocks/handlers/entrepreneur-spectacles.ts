import { HttpResponse, HttpResponseResolver } from "msw";
import entrepreneurSpectacles from "../../fixtures/entrepreneur-spectacles.json";

export const entrepreneurSpectaclesHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json(entrepreneurSpectacles);
};
