import { HttpResponse, HttpResponseResolver } from 'msw';

export const gristHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json([]);
};
