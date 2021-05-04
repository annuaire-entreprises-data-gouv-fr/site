import { ServerResponse } from 'http';
import { hasSiretFormat, hasSirenFormat } from '../helpers/siren-and-siret';

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
  siren: string
) => {
  if (exception instanceof SirenNotFoundError) {
    redirectSirenIntrouvable(res, siren);
  } else if (exception instanceof NotLuhnValidSirenError) {
    redirectSirenInvalid(res, siren);
  } else if (exception instanceof NotASirenError) {
    redirectPageNotFound(res, siren);
  } else {
    redirectServerError(res, exception.message);
  }
};

export const redirectIfIssueWithSiret = (
  res: ServerResponse,
  exception: any,
  siret: string
) => {
  if (exception instanceof SiretNotFoundError) {
    redirectSiretIntrouvable(res, siret);
  } else if (exception instanceof NotLuhnValidSiretError) {
    redirectSiretInvalid(res, siret);
  } else if (exception instanceof NotASiretError) {
    redirectPageNotFound(res, siret);
  } else {
    redirectServerError(res, exception.message);
  }
};
