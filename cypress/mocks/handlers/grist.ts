import { HttpResponse, HttpResponseResolver } from "msw";

export const gristHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json({ records: [{ fields: { siren: "908595879" } }] });
};
