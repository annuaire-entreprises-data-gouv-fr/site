import { http } from "msw";
import routes from "#clients/routes";
import { annuaireServicePublicHandler } from "./handlers/annuaire-service-public";
import { apiBioHandler } from "./handlers/api-bio";
import { apiDataGouvEssHandler } from "./handlers/api-data-gouv-ess";
import { apiDataSubventionHandler } from "./handlers/api-data-subvention";
import {
  apiGeoCommunesHandler,
  apiGeoDepartementsHandler,
  apiGeoEpcisHandler,
  apiGeoRegionsHandler,
} from "./handlers/api-geo";
import {
  apiInclusionHandler,
  apiInclusionMetadataHandler,
} from "./handlers/api-inclusion";
import {
  apiSireneInseeAuthHandler,
  apiSireneInseeSirenHandler,
  apiSireneInseeSiretHandler,
} from "./handlers/api-sirene-insee";
import {
  associationPrivateHandler,
  associationPublicHandler,
} from "./handlers/association";
import { baseAdresseNationaleHandler } from "./handlers/base-adresse-nationale";
import { bodaccHandler } from "./handlers/bodacc";
import { carteProfessionnelleTravauxPublicsHandler } from "./handlers/carte-professionnelle-travaux-publics";
import { certificationsHandler } from "./handlers/certifications";
import { conformiteHandler } from "./handlers/conformite";
import { dgefpHandler } from "./handlers/dgefp";
import { donneesFinancieresHandler } from "./handlers/donnees-financieres";
import { educationNationaleHandler } from "./handlers/education-nationale";
import { egaproHandler, egaproRepresentationHandler } from "./handlers/egapro";
import { entrepreneurSpectaclesHandler } from "./handlers/entrepreneur-spectacles";
import { eoriHandler } from "./handlers/eori";
import { gristHandler } from "./handlers/grist";
import { igHandler } from "./handlers/ig";
import { journalOfficielAssociationsHandler } from "./handlers/journal-officiel-associations";
import { liensCapitalistiquesHandler } from "./handlers/liens-capitalistiques";
import { mandatairesRcsHandler } from "./handlers/mandataires-rcs";
import { matomoReportHandler } from "./handlers/matomo-report";
import { odsMetadataHandler } from "./handlers/ods-metadata";
import { effectifsHandler } from "./handlers/rcd-effectifs-annuels";
import { rechercheEntrepriseHandler } from "./handlers/recherche-entreprises";
import { rechercheEntrepriseIdccHandler } from "./handlers/recherche-entreprises-idcc";
import { rechercheEntrepriseIdccMetadataHandler } from "./handlers/recherche-entreprises-idcc-metadata";
import { rechercheEntrepriseLastModifiedHandler } from "./handlers/recherche-entreprises-last-modified";
import { rgeHandler } from "./handlers/rge";
import {
  rneDefaultHandler,
  rneObservationsFallbackHandler,
} from "./handlers/rne";
import { s3HandlerMonitoring } from "./handlers/s3";
import { tvaHandler } from "./handlers/tva";
import { upDownIoHandler } from "./handlers/up-down-io";

const stripQueryParams = (url: string) => url.split("?")[0];

export const routesHandlers = [
  http.get(
    stripQueryParams(`${process.env.PROXY_API_URL}${routes.proxy.tva("*")}`),
    tvaHandler
  ),
  http.get(
    stripQueryParams(`${process.env.PROXY_API_URL}${routes.proxy.eori("*")}`),
    eoriHandler
  ),
  http.get(
    stripQueryParams(`${process.env.PROXY_API_URL}${routes.proxy.ig("*")}`),
    igHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.PROXY_API_URL}${routes.proxy.rne.immatriculation.default("*")}`
    ),
    rneDefaultHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.PROXY_API_URL}${routes.proxy.rne.observations.fallback("*")}`
    ),
    rneObservationsFallbackHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_RECHERCHE_ENTREPRISE_URL}${routes.rechercheEntreprise.lastModified}`
    ),
    rechercheEntrepriseLastModifiedHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_RECHERCHE_ENTREPRISE_URL}${routes.rechercheEntreprise.rechercheUniteLegale}`
    ),
    rechercheEntrepriseHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_RECHERCHE_ENTREPRISE_URL}${routes.rechercheEntreprise.idcc.metadata}`
    ),
    rechercheEntrepriseIdccMetadataHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_RECHERCHE_ENTREPRISE_URL}${routes.rechercheEntreprise.idcc.getBySiren(":siren")}`
    ),
    rechercheEntrepriseIdccHandler
  ),
  http.get(stripQueryParams(routes.certifications.rge.api), rgeHandler),
  http.get(stripQueryParams(routes.certifications.bio.api), apiBioHandler),
  http.get(
    stripQueryParams(
      routes.certifications.entrepriseInclusive.api.getBySiren("*")
    ),
    apiInclusionHandler
  ),
  http.get(
    stripQueryParams(routes.certifications.entrepriseInclusive.api.metadata),
    apiInclusionMetadataHandler
  ),
  http.get(stripQueryParams(routes.datagouv.ess), apiDataGouvEssHandler),
  http.get(
    stripQueryParams(routes.datagouv.entrepreneursSpectacles),
    entrepreneurSpectaclesHandler
  ),
  http.get(
    stripQueryParams(routes.tooling.monitoring.getBySlug("*")),
    upDownIoHandler
  ),
  http.get(
    stripQueryParams(routes.apiDataSubvention.grants("*")),
    apiDataSubventionHandler
  ),
  http.get(stripQueryParams(routes.egapro.index), egaproHandler),
  http.get(
    stripQueryParams(routes.egapro.representation),
    egaproRepresentationHandler
  ),
  http.get(
    stripQueryParams(routes.educationNationale.search),
    educationNationaleHandler
  ),
  http.get(stripQueryParams(routes.ban), baseAdresseNationaleHandler),
  http.post(routes.sireneInsee.auth, apiSireneInseeAuthHandler),
  http.get(
    stripQueryParams(routes.sireneInsee.getBySiret("*")),
    apiSireneInseeSiretHandler
  ),
  http.get(
    stripQueryParams(routes.sireneInsee.getBySiren("*")),
    apiSireneInseeSirenHandler
  ),
  http.get(stripQueryParams(routes.geo.communes), apiGeoCommunesHandler),
  http.get(
    stripQueryParams(routes.geo.departements),
    apiGeoDepartementsHandler
  ),
  http.get(stripQueryParams(routes.geo.regions), apiGeoRegionsHandler),
  http.get(stripQueryParams(routes.geo.epcis), apiGeoEpcisHandler),
  http.get(
    stripQueryParams(routes.annuaireServicePublic.ods.search),
    annuaireServicePublicHandler
  ),
  http.get(
    stripQueryParams(routes.annuaireServicePublic.ods.metadata),
    odsMetadataHandler
  ),
  http.get(
    stripQueryParams(routes.donneesFinancieres.ods.search),
    donneesFinancieresHandler
  ),
  http.get(
    stripQueryParams(routes.donneesFinancieres.ods.metadata),
    odsMetadataHandler
  ),
  http.get(stripQueryParams(routes.bodacc.ods.search), bodaccHandler),
  http.get(stripQueryParams(routes.bodacc.ods.metadata), odsMetadataHandler),
  http.get(stripQueryParams(routes.dgefp.search), dgefpHandler),
  http.get(stripQueryParams(routes.dgefp.metadata), odsMetadataHandler),
  http.get(
    stripQueryParams(routes.journalOfficielAssociations.ods.search),
    journalOfficielAssociationsHandler
  ),
  http.get(
    stripQueryParams(routes.journalOfficielAssociations.ods.metadata),
    odsMetadataHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.effectifs.annuels("*", "*")}`
    ),
    effectifsHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.dgfip.liensCapitalistiques("*", "*")}`
    ),
    liensCapitalistiquesHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.conformite.fiscale("*")}`
    ),
    conformiteHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.conformite.vigilance("*")}`
    ),
    conformiteHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.conformite.msa("*")}`
    ),
    conformiteHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.carteProfessionnelleTravauxPublics("*")}`
    ),
    carteProfessionnelleTravauxPublicsHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.certifications.cibtp("*")}`
    ),
    certificationsHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.certifications.cnetp("*")}`
    ),
    certificationsHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.certifications.probtp("*")}`
    ),
    certificationsHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.mandatairesRCS("*")}`
    ),
    mandatairesRcsHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_ASSOCIATION_URL}${routes.apiAssociation.association("*")}`
    ),
    associationPublicHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_ASSOCIATION_URL}${routes.apiAssociation.associationPartenaires("*")}`
    ),
    associationPrivateHandler
  ),
  http.get(
    stripQueryParams(
      `https://${process.env.OVH_S3_MONITORING_BUCKET}.s3.${process.env.OVH_S3_MONITORING_REGION}.io.cloud.ovh.net/monitoring_comptes_agents.csv`
    ),
    s3HandlerMonitoring
  ),
  http.post(
    stripQueryParams(routes.tooling.matomo.report.copyPasteEvents + "*"),
    matomoReportHandler
  ),
  http.post(
    stripQueryParams(routes.tooling.matomo.report.npsEvents + "*"),
    matomoReportHandler
  ),
  http.post(
    stripQueryParams(routes.tooling.matomo.report.bulkRequest + "*"),
    matomoReportHandler
  ),
  http.post(
    stripQueryParams(routes.tooling.matomo.tracker + "*"),
    matomoReportHandler
  ),
  http.get(stripQueryParams(routes.tooling.grist + "*"), gristHandler),
];
