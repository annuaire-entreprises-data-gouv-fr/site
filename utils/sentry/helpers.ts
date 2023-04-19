//=========================
//    Sentry logs helpers
//=========================

import { IScope, logWarningInSentry } from '.';

export const logFirstSireneInseefailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'GetUniteLegale : Sirene Insee failed, fallbacking',
    sentryScope
  );
export const logRechercheEntreprisefailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'GetUniteLegale : Recherche Entreprise failed, fallbacking',
    sentryScope
  );

export const logSecondSireneInseefailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'GetUniteLegale : Sirene Insee fallback failed, return 404',
    sentryScope
  );
