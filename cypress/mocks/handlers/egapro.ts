import { HttpResponse, type HttpResponseResolver } from "msw";
import egapro from "../../fixtures/egapro.json" with { type: "json" };
import egaproRepresentation from "../../fixtures/egapro-representation.json" with {
  type: "json",
};

export const egaproHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(egapro);

export const egaproRepresentationHandler: HttpResponseResolver = ({
  request,
}) => HttpResponse.json(egaproRepresentation);
