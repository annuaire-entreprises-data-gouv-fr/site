import { HttpResponse, type HttpResponseResolver } from "msw";
import certifications from "../../fixtures/certifications.json" with {
  type: "json",
};

export const certificationsHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(certifications);
