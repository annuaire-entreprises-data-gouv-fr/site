import { InternalError } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';

export const isLikelyPrestataire = (domain: string) => {
  try {
    if (domain === '@beta.gouv.fr') {
      return true;
    } else {
      if (!!domain.match(/[.@-]*(ext)(ernal|ernes|erne)*[.@-]/g)) {
        return true;
      }
      return false;
    }
  } catch (e) {
    logWarningInSentry(
      new InternalError({
        message: 'Failed to determine agent level',
        cause: e,
      })
    );
    return false;
  }
};

export const extractDomain = (email: string) => {
  try {
    return (email.match(/@(.*)/) || ['']).shift() || '';
  } catch {
    return '';
  }
};
