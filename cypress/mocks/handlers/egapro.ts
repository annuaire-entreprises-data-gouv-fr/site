import { HttpResponse, type HttpResponseResolver } from "msw";
import egapro from "../../fixtures/egapro.json";
import egaproRepresentation from "../../fixtures/egapro-representation.json";

export const egaproHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(egapro);

export const egaproRepresentationHandler: HttpResponseResolver = ({
  request,
}) => HttpResponse.json(egaproRepresentation);
