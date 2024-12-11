import { HttpResponse, HttpResponseResolver } from 'msw';
import apiDataGouvEss from '../../fixtures/api-data-gouv-ess.json';

export const apiDataGouvEssHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(apiDataGouvEss);
};
