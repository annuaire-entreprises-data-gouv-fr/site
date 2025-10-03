import { HttpResponse, HttpResponseResolver } from "msw";
import educationNationale from "../../fixtures/education-nationale.json";

export const educationNationaleHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json(educationNationale);
};
