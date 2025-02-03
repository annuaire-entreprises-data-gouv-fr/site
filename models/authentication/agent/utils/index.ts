import { InternalError } from '#models/exceptions';
import { logWarningInSentry } from '#utils/sentry';

export const isFromMCP = (idp_id: string) => {
  if (idp_id === '71144ab3-ee1a-4401-b7b3-79b44f7daeeb') {
    return true;
  } else {
    return false;
  }
};

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
