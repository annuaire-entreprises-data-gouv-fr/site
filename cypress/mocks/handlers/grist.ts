import { HttpResponse, type HttpResponseResolver } from "msw";

export const gristHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json({ records: [{ fields: { siren: "908595879" } }] });
