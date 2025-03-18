import { HttpResponse, HttpResponseResolver } from 'msw';
import { comptesAgents } from '../comptes-agents';

export const s3Handler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(comptesAgents);
};
