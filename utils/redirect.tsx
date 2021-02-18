import { Server, ServerResponse } from 'http';
import { isSirenOrSiret } from './helper';
import logErrorInSentry, { logWarningInSentry } from '../utils/sentry';

const redirectToCorrectPage = (res: ServerResponse, siretOrSiren: string) => {
  if (siretOrSiren.length === 9) {
    redirect(res, `/entreprise/${siretOrSiren}`);
  } else {
    redirect(res, `/etablissement/${siretOrSiren}`);
  }
};

export const redirectPageNotFound = (res: ServerResponse, msg: string) => {
  redirect(res, '/404');
  logWarningInSentry(new Error(`Unknown url (404) - ${msg}`));
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

export const redirectIfSiretOrSiren = (res: ServerResponse, term: string) => {
  if (!term) {
    redirect(res, '/');
  }

  if (isSirenOrSiret(term)) {
    redirectToCorrectPage(res, term);
  } else {
    const noSpace = term.split(' ').join('');
    if (isSirenOrSiret(noSpace)) {
      redirectToCorrectPage(res, noSpace);
    }
  }
};

export const redirect = (res: ServerResponse, path: string) => {
  res.writeHead(302, {
    Location: path,
  });
  res.end();
};

export default redirect;
