//=========================
//    Sentry logs helpers
//=========================

import logErrorInSentry, { IScope, logWarningInSentry } from '.';

export const logFirstSireneInseefailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'Error in Sirene Insee, fallback on Sirene Good Bot',
    sentryScope
  );
export const logRechercheEntreprisefailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'Error in Sirene Good Bot, fallback to Sirene Insee with fallback token',
    sentryScope
  );
export const logRechercheEntrepriseForGoodBotfailed = (sentryScope: IScope) =>
  logErrorInSentry(
    'Error in Sirene Good Bot, fallback to Sirene Insee or staging',
    sentryScope
  );

export const logSecondSireneInseefailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'Error in Sirene Insee using Fallback token, return 404',
    sentryScope
  );
