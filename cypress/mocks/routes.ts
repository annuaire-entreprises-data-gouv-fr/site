import routes from '#clients/routes';
import { http } from 'msw';
import { eoriHandler } from './handlers/eori';
import { tvaHandler } from './handlers/tva';

export const routesHandlers = [
  http.get(routes.proxy.tva('*'), tvaHandler),
  http.get(routes.proxy.eori('*'), eoriHandler),
];
