import { ServerResponse } from 'http';
import { isSiren, isSiret } from './helpers/siren-and-siret';
import logErrorInSentry, { logWarningInSentry } from '../utils/sentry';

export const redirectIfSiretOrSiren = (
  res: ServerResponse,
  siretOrSiren: string
) => {
  if (isSiren(siretOrSiren)) {
    redirect(res, `/entreprise/${siretOrSiren}`);
  } else if (isSiret(siretOrSiren)) {
    redirect(res, `/etablissement/${siretOrSiren}`);
  } else {
    throw new Error(`${siretOrSiren} is neither a siret or a siren`);
  }
};

export const redirectPageNotFound = (res: ServerResponse, msg: string) => {
  redirect(res, '/404');
  logWarningInSentry(new Error(`Unknown url (404) - ${msg}`));
};

export const redirectServerError = (res: ServerResponse, msg: string) => {
  redirect(res, '/500');
  logErrorInSentry(new Error(`Server Error (500) - ${msg}`));
};

export const redirectSirenIntrouvable = (
  res: ServerResponse,
  siren: string
) => {
  redirect(res, `/introuvable/siren?q=${siren}`);
  logWarningInSentry(new Error(`Siren ${siren} not found`));
};

export const redirectSiretIntrouvable = (
  res: ServerResponse,
  siret: string
) => {
  redirect(res, `/introuvable/siret?q=${siret}`);
  logWarningInSentry(new Error(`Siret ${siret} not found`));
};

export const redirect = (res: ServerResponse, path: string) => {
  res.writeHead(302, {
    Location: path,
  });
  res.end();
};

export default redirect;
