import routes from '#clients/routes';
import { http } from 'msw';
import { annuaireServicePublicHandler } from './handlers/annuaire-service-public';
import { apiBioHandler } from './handlers/api-bio';
import { apiDataGouvEssHandler } from './handlers/api-data-gouv-ess';
import { apiDataSubventionHandler } from './handlers/api-data-subvention';
import {
  apiGeoCommunesHandler,
  apiGeoDepartementsHandler,
  apiGeoEpcisHandler,
  apiGeoRegionsHandler,
} from './handlers/api-geo';
import {
  apiInclusionHandler,
  apiInclusionMetadataHandler,
} from './handlers/api-inclusion';
import {
  apiSireneInseeAuthHandler,
  apiSireneInseeSirenHandler,
  apiSireneInseeSiretHandler,
} from './handlers/api-sirene-insee';
import { associationHandler } from './handlers/association';
import { baseAdresseNationaleHandler } from './handlers/base-adresse-nationale';
import { bodaccHandler } from './handlers/bodacc';
import { dgefpHandler } from './handlers/dgefp';
import { donneesFinancieresHandler } from './handlers/donnees-financieres';
import { educationNationaleHandler } from './handlers/education-nationale';
import { egaproHandler, egaproRepresentationHandler } from './handlers/egapro';
import { entrepreneurSpectaclesHandler } from './handlers/entrepreneur-spectacles';
import { eoriHandler } from './handlers/eori';
import { igHandler } from './handlers/ig';
import { journalOfficielAssociationsHandler } from './handlers/journal-officiel-associations';
import { odsMetadataHandler } from './handlers/ods-metadata';
import { rcdHandler } from './handlers/rcd-effectifs-annuels';
import { rechercheEntrepriseHandler } from './handlers/recherche-entreprises';
import { rgeHandler } from './handlers/rge';
import { rneDefaultHandler, rneFallbackHandler } from './handlers/rne';
import { tvaHandler } from './handlers/tva';
import { upDownIoHandler } from './handlers/up-down-io';

export const routesHandlers = [
  http.get(routes.proxy.tva('*'), tvaHandler),
  http.get(routes.proxy.eori('*'), eoriHandler),
  http.get(routes.proxy.ig('*'), igHandler),
  http.get(routes.proxy.association('*'), associationHandler),
  http.get(routes.proxy.rne.immatriculation.default('*'), rneDefaultHandler),
  http.get(routes.proxy.rne.immatriculation.fallback('*'), rneFallbackHandler),
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
    routes.certifications.entrepriseInclusive.api.metadata,
    apiInclusionMetadataHandler
  ),
  http.get(routes.datagouv.ess, apiDataGouvEssHandler),
  http.get(routes.tooling.monitoring.getBySlug('*'), upDownIoHandler),
  http.get(routes.apiDataSubvention.grants('*'), apiDataSubventionHandler),
  http.get(routes.egapro.index, egaproHandler),
  http.get(routes.egapro.representation, egaproRepresentationHandler),
  http.get(routes.educationNationale.search, educationNationaleHandler),
  http.get(routes.ban, baseAdresseNationaleHandler),
  http.post(routes.sireneInsee.auth, apiSireneInseeAuthHandler),
  http.get(routes.sireneInsee.getBySiret('*'), apiSireneInseeSiretHandler),
  http.get(routes.sireneInsee.getBySiren('*'), apiSireneInseeSirenHandler),
  http.get(routes.geo.communes, apiGeoCommunesHandler),
  http.get(routes.geo.departements, apiGeoDepartementsHandler),
  http.get(routes.geo.regions, apiGeoRegionsHandler),
  http.get(routes.geo.epcis, apiGeoEpcisHandler),
  http.get(
    routes.certifications.entrepreneurSpectacles.ods.search,
    entrepreneurSpectaclesHandler
  ),
  http.get(
    routes.certifications.entrepreneurSpectacles.ods.metadata,
    odsMetadataHandler
  ),
  http.get(
    routes.annuaireServicePublic.ods.search,
    annuaireServicePublicHandler
  ),
  http.get(routes.annuaireServicePublic.ods.metadata, odsMetadataHandler),
  http.get(routes.donneesFinancieres.ods.search, donneesFinancieresHandler),
  http.get(routes.donneesFinancieres.ods.metadata, odsMetadataHandler),
  http.get(routes.bodacc.ods.search, bodaccHandler),
  http.get(routes.bodacc.ods.metadata, odsMetadataHandler),
  http.get(routes.dgefp.search, dgefpHandler),
  http.get(routes.dgefp.metadata, odsMetadataHandler),
  http.get(
    routes.journalOfficielAssociations.ods.search,
    journalOfficielAssociationsHandler
  ),
  http.get(routes.journalOfficielAssociations.ods.metadata, odsMetadataHandler),
  http.get(routes.apiEntreprise.rcd.effectifsAnnuels('*', '*'), rcdHandler),
];
