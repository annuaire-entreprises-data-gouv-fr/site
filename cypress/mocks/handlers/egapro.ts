import { HttpResponse, type HttpResponseResolver } from "msw";
import egaproRepresentation from "../../fixtures/egapro-representation.json";
import egapro from "../../fixtures/egapro.json";

export const egaproHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(egapro);
};

export const egaproRepresentationHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json(egaproRepresentation);
};
