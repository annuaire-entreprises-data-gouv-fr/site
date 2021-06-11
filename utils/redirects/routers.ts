import { ServerResponse } from 'http';
import {
  hasSiretFormat,
  hasSirenFormat,
  extractSirenFromSiret,
} from '../helpers/siren-and-siret';

import {
  NotASirenError,
  NotASiretError,
  NotLuhnValidSirenError,
  NotLuhnValidSiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '../../models';
import redirect, {
  redirectPageNotFound,
  redirectServerError,
  redirectSirenIntrouvable,
  redirectSirenInvalid,
  redirectSiretIntrouvable,
  redirectSiretInvalid,
} from '.';
import { NextApiRequest } from 'next';
import { IncomingMessage } from 'node:http';

export const redirectIfSiretOrSiren = (
  res: ServerResponse,
  siretOrSiren: string
) => {
  if (hasSirenFormat(siretOrSiren)) {
    redirect(res, `/entreprise/${siretOrSiren}`);
  } else if (hasSiretFormat(siretOrSiren)) {
    redirect(res, `/etablissement/${siretOrSiren}`);
  } else {
    throw new Error(`${siretOrSiren} is neither a siret or a siren`);
  }
};

const getScopeFromRequest = (req: IncomingMessage | undefined) => {
  return req
    ? {
        page: req.url,
        referer: req.headers.referer,
        browser: req.headers['user-agent'] as string,
      }
    : {};
};

export const redirectIfIssueWithSiren = (
  res: ServerResponse,
  exception: any,
  siren: string,
  req?: IncomingMessage
) => {
  const scope = getScopeFromRequest(req);

  if (exception instanceof SirenNotFoundError) {
    redirectSirenIntrouvable(res, siren, scope);
  } else if (exception instanceof NotLuhnValidSirenError) {
    redirectSirenInvalid(res, siren, scope);
  } else if (exception instanceof NotASirenError) {
    redirectPageNotFound(res, siren, scope);
  } else {
    redirectServerError(res, exception.message, scope);
  }
};

export const redirectIfIssueWithSiretOrSiren = (
  res: ServerResponse,
  exception: any,
  siret: string,
  req?: IncomingMessage
) => {
  const siren = extractSirenFromSiret(siret || '');

  const scope = getScopeFromRequest(req);

  if (exception instanceof SiretNotFoundError) {
    redirectSiretIntrouvable(res, siret, scope);
  } else if (exception instanceof NotLuhnValidSiretError) {
    redirectSiretInvalid(res, siret, scope);
  } else if (exception instanceof NotASiretError) {
    redirectPageNotFound(res, siret, scope);
  } else if (exception instanceof SirenNotFoundError) {
    redirectSirenIntrouvable(res, siren, scope);
  } else if (exception instanceof NotLuhnValidSirenError) {
    redirectSirenInvalid(res, siren, scope);
  } else if (exception instanceof NotASirenError) {
    redirectPageNotFound(res, siren, scope);
  } else {
    redirectServerError(res, exception.message, scope);
  }
};
