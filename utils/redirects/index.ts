import { ServerResponse } from 'http';
import logErrorInSentry, { logWarningInSentry } from '../sentry';

export const redirect = (res: ServerResponse, path: string) => {
  res.writeHead(302, {
    Location: path,
  });
  res.end();
};

export const redirectPageNotFound = (
  res: ServerResponse,
  msg: string,
  page?: string
) => {
  redirect(res, '/404');
  logWarningInSentry('Unknown url (404)', { details: msg, page });
};

export const redirectServerError = (
  res: ServerResponse,
  msg: string,
  page?: string
) => {
  redirect(res, '/500');
  logErrorInSentry(new Error('Server Error (500)'), { details: msg, page });
};

/**
 * Siren/Siret is NOT valid
 */
export const redirectSirenInvalid = (
  res: ServerResponse,
  siren: string,
  page?: string
) => {
  redirect(res, `/invalide/siren?q=${siren}`);
  logWarningInSentry('Siren is invalid', { siren, page });
};

export const redirectSiretInvalid = (
  res: ServerResponse,
  siret: string,
  page?: string
) => {
  redirect(res, `/invalide/siret?q=${siret}`);
  logWarningInSentry('Siret is invalid', { siret, page });
};

/**
 * Siren/Siret is valid but not found
 */
export const redirectSirenIntrouvable = (
  res: ServerResponse,
  siren: string,
  page?: string
) => {
  redirect(res, `/introuvable/siren?q=${siren}`);
  logWarningInSentry('Siren not found', { siren, page });
};

export const redirectSiretIntrouvable = (
  res: ServerResponse,
  siret: string,
  page?: string
) => {
  redirect(res, `/introuvable/siret?q=${siret}`);
  logWarningInSentry('Siret not found', { siret, page });
};

export default redirect;
