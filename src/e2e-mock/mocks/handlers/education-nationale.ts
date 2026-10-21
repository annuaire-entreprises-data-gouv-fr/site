import { HttpResponse, type HttpResponseResolver } from "msw/http";
import educationNationale from "../../fixtures/education-nationale.json" with {
  type: "json",
};

export const educationNationaleHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(educationNationale);
