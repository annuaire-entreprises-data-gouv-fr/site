import { InternalError } from '#models/index';
import { hasSirenFormat, hasSiretFormat } from '#utils/helpers';

export const redirectPageNotFound = (): { notFound: true } => {
  return {
    notFound: true,
  };
};

export const redirectServerError = () => {
  return {
    redirect: {
      destination: '/500',
      permanent: false,
    },
  };
};

export const redirectSearchEngineError = () => {
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
export const redirectSirenOrSiretInvalid = (sirenOrSiret: string) => {
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
export const redirectSirenOrSiretIntrouvable = (sirenOrSiret: string) => {
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
    throw new InternalError({
      message: `${siretOrSiren} is neither a siret or a siren`,
    });
  }
  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
};
