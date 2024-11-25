import { HttpResponse, HttpResponseResolver } from 'msw';

export const tvaHandler: HttpResponseResolver = ({ request }) => {
  let vatNumber: string | null = '12345678901';
  let isValid: boolean | undefined = true;

  if (request.url.match('842019051')) {
    vatNumber = '43842019051';
  } else if (request.url.match('217500016')) {
    vatNumber = '72217500016';
  } else if (request.url.match('423208180') || request.url.match('383657467')) {
    isValid = undefined;
    vatNumber = null;
  }

  return HttpResponse.json({ isValid, vatNumber });
};
