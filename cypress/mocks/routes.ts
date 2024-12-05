import routes from '#clients/routes';
import { http } from 'msw';
import { eoriHandler } from './handlers/eori';
import { rechercheEntrepriseHandler } from './handlers/recherche-entreprises';
import { tvaHandler } from './handlers/tva';

export const routesHandlers = [
  http.get(routes.proxy.tva('*'), tvaHandler),
  http.get(routes.proxy.eori('*'), eoriHandler),
  http.get(
    `${routes.rechercheEntreprise.rechercheUniteLegale}`,
    rechercheEntrepriseHandler
  ),
];
