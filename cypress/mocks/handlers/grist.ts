import { HttpResponse, type HttpResponseResolver } from "msw";

export const gristHandler: HttpResponseResolver = ({ request }) => {
  if (request.url.includes("NPS_Feedbacks")) {
    return HttpResponse.json({
      records: [],
    });
  }
  return HttpResponse.json({ records: [{ fields: { siren: "908595879" } }] });
};
