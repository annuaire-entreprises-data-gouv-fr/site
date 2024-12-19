import { HttpResponse, HttpResponseResolver } from 'msw';
import rcd from '../../fixtures/rcd-effectifs-annuels.json';

export const rcdHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(rcd);
};
