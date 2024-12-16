import { HttpResponse, HttpResponseResolver } from 'msw';
import apiBio from '../../fixtures/api-bio.json';

export const apiBioHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(apiBio);
};
