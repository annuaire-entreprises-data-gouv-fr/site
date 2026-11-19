import { HttpResponse, type HttpResponseResolver } from "msw/http";
import type { IRNEProxyResponse } from "#/clients/api-proxy/rne/types";

const dirigeants: IRNEProxyResponse["dirigeants"] = [
  {
    nom: "Le Moine",
    prenom: "Élodie, Anne",
    dateNaissancePartial: "1978-04",
    role: "Présidente",
    estDemissionnaire: false,
    dateDemission: null,
  },
  {
    nom: "Le Moine",
    prenom: "Élodie",
    dateNaissancePartial: "1983-09",
    role: "Directrice",
    estDemissionnaire: false,
    dateDemission: null,
  },
  {
    denomination: "HOLDING TEMOIN",
    siren: "990000069",
    natureJuridique: "SAS",
    role: "Administrateur",
  },
];

export const rneDefaultHandler: HttpResponseResolver = ({ request }) => {
  const siren = new URL(request.url).pathname.split("/").pop();
  switch (siren) {
    case "908595879":
    case "990000010":
    case "990000044":
      return HttpResponse.json({ dirigeants, observations: [] });
    case "990000028":
      return HttpResponse.json({ dirigeants: [], observations: [] });
    case "990000036":
      return new HttpResponse(null, { status: 503 });
    default:
      return HttpResponse.json({});
  }
};

export const rneObservationsFallbackHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json([]);
