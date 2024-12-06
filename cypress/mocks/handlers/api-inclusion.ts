import { HttpResponse, HttpResponseResolver } from 'msw';
import apiInclusion from '../../fixtures/api-inclusion.json';

export const apiInclusionHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(apiInclusion);
};
