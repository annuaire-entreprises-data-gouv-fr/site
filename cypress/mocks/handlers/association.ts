import { HttpResponse, type HttpResponseResolver } from "msw";

export const associationHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json({});

export const associationPartenairesHandler: HttpResponseResolver = () =>
  HttpResponse.text("<asso></asso>", {
    headers: {
      "Content-Type": "application/xml",
    },
  });
