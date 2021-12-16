import { IncomingMessage } from 'http';
import {
  hasSiretFormat,
  hasSirenFormat,
  extractSirenFromSiretNoVerify,
} from '../helpers/siren-and-siret';

import {
  NotASirenError,
  NotASiretError,
  NotLuhnValidSirenError,
  NotLuhnValidSiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '../../models';
import {
  redirectPageNotFound,
  redirectServerError,
  redirectSirenOrSiretIntrouvable,
  redirectSirenOrSiretInvalid,
} from '.';

export const redirectIfSiretOrSiren = (siretOrSiren: string) => {
  let destination;
  if (hasSiretFormat(siretOrSiren)) {
    destination = `/etablissement/${siretOrSiren}`;
  } else if (hasSirenFormat(siretOrSiren)) {
    destination = `/entreprise/${siretOrSiren}`;
  } else {
    throw new Error(`${siretOrSiren} is neither a siret or a siren`);
  }
  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
};

const getScopeFromRequest = (req: IncomingMessage | undefined) => {
  const headers = req ? req.headers : {};
  return req
    ? {
        page: req.url,
        referer: headers.referer,
        browser: headers['user-agent'] as string,
      }
    : {};
};

export const redirectIfIssueWithSiren = (
  exception: any,
  siren: string,
  req?: IncomingMessage
) => {
  const scope = { siren, ...getScopeFromRequest(req) };

  if (exception instanceof SirenNotFoundError) {
    return redirectSirenOrSiretIntrouvable(siren, scope);
  } else if (exception instanceof NotLuhnValidSirenError) {
    return redirectSirenOrSiretInvalid(siren, scope);
  } else if (exception instanceof NotASirenError) {
    return redirectPageNotFound(siren, scope);
  } else {
    return redirectServerError(exception.message, scope);
  }
};

export const redirectIfIssueWithSiretOrSiren = (
  exception: any,
  siret: string,
  req?: IncomingMessage
) => {
  const siren = extractSirenFromSiretNoVerify(siret || '');

  const scope = { siren, siret, ...getScopeFromRequest(req) };

  if (exception instanceof SiretNotFoundError) {
    return redirectSirenOrSiretIntrouvable(siret, scope);
  } else if (exception instanceof NotLuhnValidSiretError) {
    return redirectSirenOrSiretInvalid(siret, scope);
  } else if (exception instanceof NotASiretError) {
    return redirectPageNotFound(siret, scope);
  } else if (exception instanceof SirenNotFoundError) {
    return redirectSirenOrSiretIntrouvable(siren, scope);
  } else if (exception instanceof NotLuhnValidSirenError) {
    return redirectSirenOrSiretInvalid(siren, scope);
  } else if (exception instanceof NotASirenError) {
    return redirectPageNotFound(siren, scope);
  } else {
    return redirectServerError(exception.message, scope);
  }
};
