import { comptesAgents } from '#cypress/fixtures/comptes-agents';
import { HttpResponse, HttpResponseResolver } from 'msw';

export const s3Handler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(comptesAgents);
};
