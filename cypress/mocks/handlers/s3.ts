import { HttpResponse, HttpResponseResolver } from 'msw';
import { comptesAgents, comptesAgentsMonitoring } from '../comptes-agents';

export const s3Handler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(comptesAgents);
};

export const s3HandlerMonitoring: HttpResponseResolver = ({ request }) => {
  return HttpResponse.text(comptesAgentsMonitoring);
};
