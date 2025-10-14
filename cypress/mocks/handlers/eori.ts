import { HttpResponse, type HttpResponseResolver } from "msw";

export const eoriHandler: HttpResponseResolver = ({ request }) => {
  let eori = "FR1234567890";
  let isValid = true;

  if (request.url.match("88301031600015")) {
    eori = "FR43842019051";
    isValid = false;
  }

  return HttpResponse.json({ isValid, eori });
};
