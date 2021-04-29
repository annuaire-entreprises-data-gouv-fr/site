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
  logWarningInSentry(`Unknown url (404) - ${msg}`);
};

export const redirectServerError = (res: ServerResponse, msg: string) => {
  redirect(res, '/500');
  logErrorInSentry(`Server Error (500) - ${msg}`);
};

export const redirectSirenIntrouvable = (
  res: ServerResponse,
  siren: string
) => {
  redirect(res, `/introuvable/siren?q=${siren}`);
  logWarningInSentry(`Siren ${siren} not found`);
};

export const redirectSiretIntrouvable = (
  res: ServerResponse,
  siret: string
) => {
  redirect(res, `/introuvable/siret?q=${siret}`);
  logWarningInSentry(`Siret ${siret} not found`);
};

export const redirect = (res: ServerResponse, path: string) => {
  res.writeHead(302, {
    Location: path,
  });
  res.end();
};

export default redirect;
