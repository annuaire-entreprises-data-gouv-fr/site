import { HttpResponse, HttpResponseResolver } from "msw";
import certifications from "../../fixtures/certifications.json";

export const certificationsHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(certifications);
};
