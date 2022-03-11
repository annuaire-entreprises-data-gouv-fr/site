import { ServerResponse } from 'http';
import { hasSirenFormat, hasSiretFormat } from '../helpers/siren-and-siret';
import logErrorInSentry, { IScope, logWarningInSentry } from '../sentry';

/**
 * Use next js buit-in redirection when possible
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 *
 * Use this method for /api/... methods only
 *
 * @param res
 * @param path
 */
export const redirect = (res: ServerResponse, path: string) => {
  res.writeHead(302, {
    Location: path,
  });
  res.end();
};

export const redirectForbidden = (msg: string, scope?: IScope) => {
  logWarningInSentry('Access Forbidden', {
    details: msg,
    ...scope,
  });
  return {
    redirect: {
      destination: '/erreur/acces-refuse',
      permanent: false,
    },
  };
};

export const redirectPageNotFound = (
  msg: string,
  scope?: IScope
): { notFound: true } => {
  logWarningInSentry('Unknown url (404)', {
    details: msg,
    ...scope,
  });
  return {
    notFound: true,
  };
};

export const redirectServerError = (msg: string, scope?: IScope) => {
  logErrorInSentry(new Error('Server Error (500)'), { details: msg, ...scope });
  return {
    redirect: {
      destination: '/500',
      permanent: false,
    },
  };
};

/**
 * Siren/Siret is NOT valid
 */
export const redirectSirenOrSiretInvalid = (
  sirenOrSiret: string,
  scope?: IScope
) => {
  logWarningInSentry('Siren or siret is invalid', scope);
  return {
    redirect: {
      destination: `/erreur/invalide?q=${sirenOrSiret}`,
      permanent: false,
    },
  };
};
/**
 * Siren/Siret is valid but not found
 */
export const redirectSirenOrSiretIntrouvable = (
  sirenOrSiret: string,
  scope?: IScope
) => {
  logWarningInSentry('Siren or siret not found', scope);
  return {
    redirect: {
      destination: `/erreur/introuvable?q=${sirenOrSiret}`,
      permanent: false,
    },
  };
};

export const redirectIfSiretOrSiren = (siretOrSiren: string) => {
  let destination;
  if (hasSiretFormat(siretOrSiren)) {
    destination = `/etablissement/${siretOrSiren}`;
  } else if (hasSirenFormat(siretOrSiren)) {
    destination = `/entreprise/${siretOrSiren}`;
  } else {
    throw new Error(`${siretOrSiren} is neither a siret or a siren`);
  }
  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
};

export default redirect;
