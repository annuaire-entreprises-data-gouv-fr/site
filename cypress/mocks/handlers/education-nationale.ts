import { HttpResponse, type HttpResponseResolver } from "msw";
import educationNationale from "../../fixtures/education-nationale.json" with {
  type: "json",
};

export const educationNationaleHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(educationNationale);
