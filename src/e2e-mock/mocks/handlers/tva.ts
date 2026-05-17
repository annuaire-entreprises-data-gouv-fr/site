import { HttpResponse, type HttpResponseResolver } from "msw";

export const tvaHandler: HttpResponseResolver = ({ request }) => {
  let tva: string | null = "12345678901";

  if (request.url.match("842019051")) {
    tva = "43842019051";
  } else if (request.url.match("217500016")) {
    tva = "72217500016";
  } else if (request.url.match("423208180") || request.url.match("383657467")) {
    tva = null;
  }

  return HttpResponse.json({ tva });
};
