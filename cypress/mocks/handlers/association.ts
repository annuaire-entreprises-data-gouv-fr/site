import { HttpResponse, HttpResponseResolver } from 'msw';

export const associationHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json({});
};
