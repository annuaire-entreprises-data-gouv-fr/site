
import { ServerResponse } from 'http';
import { isSirenOrSiret } from './helper';

const redirectToEtablissement = (res: ServerResponse, siretOrSiren: string) => {
  if (siretOrSiren.length === 9) {
    redirect(res, `/entreprise/${siretOrSiren}`);
  } else {
    redirect(res, `/etablissement/${siretOrSiren}`);
  }
};

export const redirectIfSiretOrSiren = (res: ServerResponse, term: string) => {
  if (!term) {
    redirect(res, '/');
  }

  if (isSirenOrSiret(term)) {
    redirectToEtablissement(res, term);
  } else {
    const noSpace = term.split(' ').join('');
    if (isSirenOrSiret(noSpace)) {
      redirectToEtablissement(res, noSpace);
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