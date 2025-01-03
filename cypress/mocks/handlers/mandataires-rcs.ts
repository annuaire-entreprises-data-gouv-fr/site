import { HttpResponse, HttpResponseResolver } from 'msw';
import mandatairesRcs from '../../fixtures/mandataires-rcs.json';

export const mandatairesRcsHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(mandatairesRcs);
};
