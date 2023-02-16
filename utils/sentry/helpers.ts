//=========================
//    Sentry logs helpers
//=========================

import { IScope, logWarningInSentry } from '.';

export const logFirstSireneInseefailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'Server error in Sirene Insee, fallback on Sirene Ouverte (Etalab)',
    sentryScope
  );
export const logRechercheEntreprisefailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'Server error in SireneEtalab, fallback to Sirene Insee with fallback token',
    sentryScope
  );
export const logRechercheEntrepriseForGoodBotfailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'Server error in SireneEtalab (good bot), fallback to Sirene Insee or staging',
    sentryScope
  );

export const logSecondSireneInseefailed = (sentryScope: IScope) =>
  logWarningInSentry(
    'Server error in Sirene Insee using Fallback token, return 404',
    sentryScope
  );
