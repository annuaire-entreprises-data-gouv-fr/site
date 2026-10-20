import { HttpResponse, type HttpResponseResolver } from "msw/http";
import certifications from "../../fixtures/certifications.json" with {
  type: "json",
};

export const certificationsHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(certifications);
