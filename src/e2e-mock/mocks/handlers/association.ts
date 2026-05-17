import { HttpResponse, type HttpResponseResolver } from "msw";
import apiAssociationPrivate from "../../fixtures/api-association-private";
import apiAssociationPublic from "../../fixtures/api-association-public.json" with {
  type: "json",
};

export const associationPublicHandler: HttpResponseResolver = ({ request }) => {
  if (request.url.includes("400461356")) {
    return HttpResponse.json(apiAssociationPublic);
  }
  throw new Error("Unknown error");
};

export const associationPrivateHandler: HttpResponseResolver = ({
  request,
}) => {
  if (request.url.includes("400485504")) {
    return HttpResponse.text(apiAssociationPrivate, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
  throw new Error("Unknown error");
};
