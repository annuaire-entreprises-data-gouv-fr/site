import fs from "node:fs";
import path from "node:path";
import {
  HttpResponse,
  type HttpResponseResolver,
  http,
  type JsonBodyType,
} from "msw";
import { setupServer } from "msw/node";
import routes from "#clients/routes";

const fixturesDir = path.join(
  process.cwd(),
  "unit-tests",
  "recherche-entreprise",
  "fixtures"
);

function readFixture<T>(fileName: string): T {
  const fixturePath = path.join(fixturesDir, fileName);

  if (!fs.existsSync(fixturePath)) {
    throw new Error(`Missing unit test fixture: ${fixturePath}`);
  }

  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

const stripQueryParams = (url: string) => url.split("?")[0];

const rechercheEntrepriseHandler: HttpResponseResolver = async ({
  request,
}) => {
  const q = new URL(request.url).searchParams.get("q");

  if (!q) {
    throw new Error(`Missing q parameter for ${request.url}`);
  }

  const snapshot = readFixture<{ result: unknown }>(`search-${q}.json`);
  return HttpResponse.json(snapshot.result as JsonBodyType);
};

const rechercheEntrepriseIdccHandler: HttpResponseResolver = async () =>
  HttpResponse.json(readFixture("recherche-entreprise-idcc.json"));

const rechercheEntrepriseIdccMetadataHandler: HttpResponseResolver = async () =>
  HttpResponse.json(readFixture("recherche-entreprise-idcc-metadata.json"));

const rechercheEntrepriseLastModifiedHandler: HttpResponseResolver = async () =>
  HttpResponse.json(readFixture("recherche-entreprise-last-modified.json"));

export const rechercheEntrepriseMockServer = setupServer(
  http.get(
    stripQueryParams(
      `${process.env.API_RECHERCHE_ENTREPRISE_URL}${routes.rechercheEntreprise.rechercheUniteLegale}`
    ),
    rechercheEntrepriseHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_RECHERCHE_ENTREPRISE_URL}${routes.rechercheEntreprise.idcc.getBySiren(":siren")}`
    ),
    rechercheEntrepriseIdccHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_RECHERCHE_ENTREPRISE_URL}${routes.rechercheEntreprise.idcc.metadata}`
    ),
    rechercheEntrepriseIdccMetadataHandler
  ),
  http.get(
    stripQueryParams(
      `${process.env.API_RECHERCHE_ENTREPRISE_URL}${routes.rechercheEntreprise.lastModified}`
    ),
    rechercheEntrepriseLastModifiedHandler
  )
);
