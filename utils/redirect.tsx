
import { ServerResponse } from 'http';
import { isSirenOrSiret } from './helper';
import logErrorInSentry from '../utils/sentry';

const redirectToCorrectPage = (res: ServerResponse, siretOrSiren: string) => {
  if (siretOrSiren.length === 9) {
    redirect(res, `/entreprise/${siretOrSiren}`);
  } else {
    redirect(res, `/etablissement/${siretOrSiren}`);
  }
};

export const redirectSirenIntrouvable = (
  res: ServerResponse,
  siren: string
) => {
  redirect(res, `/introuvable/siren?q=${siren}`);
  logErrorInSentry(new Error(`Siren ${siren} not found`));
};

export const redirectSiretIntrouvable = (
  res: ServerResponse,
  siret: string
) => {
  redirect(res, `/introuvable/siret?q=${siret}`);
  logErrorInSentry(new Error(`Siret ${siret} not found`));
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