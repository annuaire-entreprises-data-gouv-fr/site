import routes from '#clients/routes';
import { http } from 'msw';
import { apiBioHandler } from './handlers/api-bio';
import { apiDataGouvEssHandler } from './handlers/api-data-gouv-ess';
import { apiDataSubventionHandler } from './handlers/api-data-subvention';
import { apiInclusionHandler } from './handlers/api-inclusion';
import {
  apiSireneInseeAuthHandler,
  apiSireneInseeSirenHandler,
  apiSireneInseeSiretHandler,
} from './handlers/api-sirene-insee';
import { baseAdresseNationaleHandler } from './handlers/base-adresse-nationale';
import { educationNationaleHandler } from './handlers/education-nationale';
import { egaproHandler, egaproRepresentationHandler } from './handlers/egapro';
import { entrepreneurSpectaclesHandler } from './handlers/entrepreneur-spectacles';
import { eoriHandler } from './handlers/eori';
import { rechercheEntrepriseHandler } from './handlers/recherche-entreprises';
import { rgeHandler } from './handlers/rge';
import { tvaHandler } from './handlers/tva';
import { upDownIoHandler } from './handlers/up-down-io';

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
    routes.certifications.entrepriseInclusive.api.getBySiren('*'),
    apiInclusionHandler
  ),
  http.get(
    routes.certifications.entrepreneurSpectacles.ods.search,
    entrepreneurSpectaclesHandler
  ),
  http.get(routes.datagouv.ess, apiDataGouvEssHandler),
  http.get(routes.tooling.monitoring.getBySlug('*'), upDownIoHandler),
  http.get(routes.apiDataSubvention.grants('*'), apiDataSubventionHandler),
  http.get(routes.egapro.index, egaproHandler),
  http.get(routes.egapro.representation, egaproRepresentationHandler),
  http.get(routes.educationNationale.search, educationNationaleHandler),
  http.get(routes.ban, baseAdresseNationaleHandler),
  http.post(routes.sireneInsee.auth, apiSireneInseeAuthHandler),
  http.get(routes.sireneInsee.siret, apiSireneInseeSiretHandler),
  http.get(routes.sireneInsee.siren, apiSireneInseeSirenHandler),
];
