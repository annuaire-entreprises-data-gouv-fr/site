import { hasSirenFormat, hasSiretFormat } from '#utils/helpers';
import { IScope, logWarningInSentry } from '#utils/sentry';

export const redirectPageNotFound = (
  msg: string,
  scope?: IScope
): { notFound: true } => {
  logWarningInSentry('Redirect 404 page', {
    details: msg,
    ...scope,
  });
  return {
    notFound: true,
  };
};

export const redirectServerError = (msg: string, scope?: IScope) => {
  logWarningInSentry('Redirect 500 page', {
    details: msg,
    ...scope,
  });
  return {
    redirect: {
      destination: '/500',
      permanent: false,
    },
  };
};

export const redirectSearchEngineError = (msg: string, scope?: IScope) => {
  logWarningInSentry('Redirect search error page', {
    details: msg,
    ...scope,
  });
  return {
    redirect: {
      destination: '/rechercher/erreur',
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
  logWarningInSentry('Redirect siren or siret invalid', scope);
  return {
    redirect: {
      destination: `/erreur/invalide/${sirenOrSiret}`,
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
  logWarningInSentry('Redirect siren or siret not found', scope);
  return {
    redirect: {
      destination: `/erreur/introuvable/${sirenOrSiret}`,
      permanent: false,
    },
  };
};

export const redirectIfSiretOrSiren = (siretOrSiren: string) => {
  let destination;
  if (hasSiretFormat(siretOrSiren)) {
    destination = `/etablissement/${siretOrSiren}?redirected=1`;
  } else if (hasSirenFormat(siretOrSiren)) {
    destination = `/entreprise/${siretOrSiren}?redirected=1`;
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
