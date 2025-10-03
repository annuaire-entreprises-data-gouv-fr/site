import { HttpResponse, HttpResponseResolver } from "msw";
import { comptesAgentsMonitoring } from "../comptes-agents";

export const s3HandlerMonitoring: HttpResponseResolver = ({ request }) => {
  return HttpResponse.text(comptesAgentsMonitoring);
};
