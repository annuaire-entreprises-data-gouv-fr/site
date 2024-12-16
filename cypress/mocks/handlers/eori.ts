import { HttpResponse, HttpResponseResolver } from 'msw';

export const eoriHandler: HttpResponseResolver = ({ request }) => {
  let eori = '1234567890';
  let isValid = true;

  if (request.url.match('88301031600015')) {
    eori = '43842019051';
    isValid = false;
  }

  return HttpResponse.json({ isValid, eori });
};
