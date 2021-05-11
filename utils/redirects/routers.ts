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

export const redirectIfIssueWithSiren = (
  res: ServerResponse,
  exception: any,
  siren: string,
  path?: string
) => {
  if (exception instanceof SirenNotFoundError) {
    redirectSirenIntrouvable(res, siren, path);
  } else if (exception instanceof NotLuhnValidSirenError) {
    redirectSirenInvalid(res, siren, path);
  } else if (exception instanceof NotASirenError) {
    redirectPageNotFound(res, siren, path);
  } else {
    redirectServerError(res, exception.message, path);
  }
};

export const redirectIfIssueWithSiretOrSiren = (
  res: ServerResponse,
  exception: any,
  siret: string,
  path?: string
) => {
  const siren = extractSirenFromSiret(siret || '');

  if (exception instanceof SiretNotFoundError) {
    redirectSiretIntrouvable(res, siret, path);
  } else if (exception instanceof NotLuhnValidSiretError) {
    redirectSiretInvalid(res, siret, path);
  } else if (exception instanceof NotASiretError) {
    redirectPageNotFound(res, siret, path);
  } else if (exception instanceof SirenNotFoundError) {
    redirectSirenIntrouvable(res, siren, path);
  } else if (exception instanceof NotLuhnValidSirenError) {
    redirectSirenInvalid(res, siren, path);
  } else if (exception instanceof NotASirenError) {
    redirectPageNotFound(res, siren, path);
  } else {
    redirectServerError(res, exception.message, path);
  }
};
