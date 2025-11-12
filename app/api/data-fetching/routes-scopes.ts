import { ApplicationRights } from "#models/authentication/user/rights";
import { APIRoutesPaths } from "./routes-paths";

export const APIRoutesScopes: Record<APIRoutesPaths, ApplicationRights> = {
  // full open data & RNE
  [APIRoutesPaths.RneDirigeants]: ApplicationRights.opendata,
  [APIRoutesPaths.Observations]: ApplicationRights.opendata,
  [APIRoutesPaths.Association]: ApplicationRights.opendata,
  [APIRoutesPaths.VerifyTva]: ApplicationRights.opendata,
  [APIRoutesPaths.EoriValidation]: ApplicationRights.opendata,
};
