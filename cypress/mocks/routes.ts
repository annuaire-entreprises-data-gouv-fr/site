import routes from '#clients/routes';
import { http } from 'msw';
import { apiBioHandler } from './handlers/api-bio';
import { apiDataGouvEssHandler } from './handlers/api-data-gouv-ess';
import { apiInclusionHandler } from './handlers/api-inclusion';
import { entrepreneurSpectaclesHandler } from './handlers/entrepreneur-spectacles';
import { eoriHandler } from './handlers/eori';
import { rechercheEntrepriseHandler } from './handlers/recherche-entreprises';
import { rgeHandler } from './handlers/rge';
import { tvaHandler } from './handlers/tva';

export const routesHandlers = [
  http.get(routes.proxy.tva('*'), tvaHandler),
  http.get(routes.proxy.eori('*'), eoriHandler),
  http.get(
    routes.rechercheEntreprise.rechercheUniteLegale,
    rechercheEntrepriseHandler
  ),
  http.get(routes.certifications.rge.api, rgeHandler),
  http.get(routes.certifications.bio.api, apiBioHandler),
  http.get(
    routes.certifications.entrepriseInclusive.api.siren,
    apiInclusionHandler
  ),
  http.get(
    routes.certifications.entrepreneurSpectacles.ods.search,
    entrepreneurSpectaclesHandler
  ),
  http.get(routes.datagouv.ess, apiDataGouvEssHandler),
];
