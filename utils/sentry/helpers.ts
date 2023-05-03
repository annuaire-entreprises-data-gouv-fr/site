//=========================
//    Sentry logs helpers
//=========================

import { IScope, logWarningInSentry } from '.';

export const logRechercheEntreprisefailed = (sentryScope: IScope) =>
  logWarningInSentry('Recherche Entreprise failed, fallbacking', sentryScope);

export const logSireneInseefailed = (
  sentryScope: IScope,
  useFallback = false
) => {
  logWarningInSentry(
    `Sirene Insee ${useFallback ? 'fallback ' : ''}failed`,
    sentryScope
  );
};
