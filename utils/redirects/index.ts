import { ServerResponse } from 'http';
import logErrorInSentry, { IScope, logWarningInSentry } from '../sentry';

export const redirect = (res: ServerResponse, path: string) => {
  res.writeHead(302, {
    Location: path,
  });
  res.end();
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
export const redirectSirenInvalid = (
  res: ServerResponse,
  siren: string,
  scope?: IScope
) => {
  redirect(res, `/erreur/invalide/siren?q=${siren}`);
  logWarningInSentry('Siren is invalid', { siren, ...scope });
};

export const redirectSiretInvalid = (
  res: ServerResponse,
  siret: string,
  scope?: IScope
) => {
  redirect(res, `/erreur/invalide/siret?q=${siret}`);
  logWarningInSentry('Siret is invalid', { siret, ...scope });
};

/**
 * Siren/Siret is valid but not found
 */
export const redirectSirenIntrouvable = (
  res: ServerResponse,
  siren: string,
  scope?: IScope
) => {
  redirect(res, `/erreur/introuvable/siren?q=${siren}`);
  logWarningInSentry('Siren not found', { siren, ...scope });
};

export const redirectSiretIntrouvable = (
  res: ServerResponse,
  siret: string,
  scope?: IScope
) => {
  redirect(res, `/erreur/introuvable/siret?q=${siret}`);
  logWarningInSentry('Siret not found', { siret, ...scope });
};

export default redirect;
