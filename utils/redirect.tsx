
import { ServerResponse } from 'http';
import { isSirenOrSiret } from './helper';

export const redirectIfSiretOrSiren = (res: ServerResponse, term: string) => {
  if (isSirenOrSiret(term)) {
    redirect(res, `/entreprise/${term}`);
  } else {
    const noSpace = term.split(' ').join('');
    if (isSirenOrSiret(noSpace)) {
      redirect(res, `/entreprise/${noSpace}`);
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