//=========================
//    Sentry logs helpers
//=========================

import { IScope, logWarningInSentry } from '.';

export const logFirstSireneInseefailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'GetUniteLegale : Sirene Insee failed, fallback on Sirene Good Bot',
    sentryScope
  );
export const logRechercheEntreprisefailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'GetUniteLegale : Sirene Good Bot failed, fallback to Sirene Insee fallback',
    sentryScope
  );

export const logRechercheEntrepriseForGoodBotfailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'GetUniteLegale(Bot) : Sirene Good Bot and  staging/insee fallback failed, return 500',
    sentryScope
  );

export const logSecondSireneInseefailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'GetUniteLegale : Sirene Insee fallback failed, return 500',
    sentryScope
  );
