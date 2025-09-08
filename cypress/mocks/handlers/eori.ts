import { HttpResponse, type HttpResponseResolver } from "msw";

export const eoriHandler: HttpResponseResolver = ({ request }) => {
  let id = "FR123456789";
  let actif = true;

  if (request.url.match("88301031600015")) {
    id = "FR438420190";
    actif = false;
  }

  return HttpResponse.json({ data: { id, actif } });
};
