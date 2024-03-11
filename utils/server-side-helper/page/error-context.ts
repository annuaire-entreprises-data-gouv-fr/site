import { IncomingMessage } from 'http';
import { IExceptionContext } from '#models/exceptions';
import { verifySiren, verifySiret } from '#utils/helpers';

export const getContext = (
  req: IncomingMessage | undefined,
  slug: string
): IExceptionContext => {
  let sirenOrSiret = {} as any;

  try {
    sirenOrSiret = { siren: verifySiren(slug) };
  } catch {
    try {
      sirenOrSiret = {
        siret: verifySiret(slug),
      };
    } catch {
      sirenOrSiret.slug = slug;
    }
  }

  const headers = req?.headers || {};
  const metadata = req
    ? {
        page: req.url,
        referer: headers['referer'],
        browser: headers['user-agent'] as string,
      }
    : {};

  return {
    ...metadata,
    ...sirenOrSiret,
  };
};
