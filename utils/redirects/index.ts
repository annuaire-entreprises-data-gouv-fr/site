import { ServerResponse } from 'http';
import logErrorInSentry, { IScope, logWarningInSentry } from '../sentry';

export const redirect = (res: ServerResponse, path: string) => {
  res.writeHead(302, {
    Location: path,
  });
  res.end();
};

export const redirectForbidden = (
  res: ServerResponse,
  msg: string,
  scope?: IScope
) => {
  redirect(res, '/403');
  logWarningInSentry('Access Forbidden', {
    details: msg,
    ...scope,
  });
};

export const redirectPageNotFound = (
  res: ServerResponse,
  msg: string,
  scope?: IScope
) => {
  redirect(res, '/404');
  logWarningInSentry('Unknown url (404)', {
    details: msg,
    ...scope,
  });
};

export const redirectServerError = (
  res: ServerResponse,
  msg: string,
  scope?: IScope
) => {
  redirect(res, '/500');
  logErrorInSentry(new Error('Server Error (500)'), { details: msg, ...scope });
};

/**
 * Siren/Siret is NOT valid
 */
export const redirectSirenOrSiretInvalid = (
  res: ServerResponse,
  sirenOrSiret: string,
  scope?: IScope
) => {
  redirect(res, `/erreur/invalide?q=${sirenOrSiret}`);
  logWarningInSentry('Siren or siret is invalid', scope);
};
/**
 * Siren/Siret is valid but not found
 */
export const redirectSirenOrSiretIntrouvable = (
  res: ServerResponse,
  sirenOrSiret: string,
  scope?: IScope
) => {
  redirect(res, `/erreur/introuvable?q=${sirenOrSiret}`);
  logWarningInSentry('Siren or siret not found', scope);
};

export default redirect;
