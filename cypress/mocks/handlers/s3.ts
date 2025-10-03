import { HttpResponse, type HttpResponseResolver } from "msw";
import { comptesAgentsMonitoring } from "../comptes-agents";

export const s3HandlerMonitoring: HttpResponseResolver = ({ request }) =>
  HttpResponse.text(comptesAgentsMonitoring);
