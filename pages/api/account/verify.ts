import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../utils/session';
import { getUser, ISession } from '../../../utils/session/accessSession';
import { verifyDirigeant } from '../../../clients/dirigeant-insee/verify';
import { getUniteLegaleFromSlug } from '../../../models/unite-legale';
import { verifySiren } from '../../../utils/helpers/siren-and-siret';
import {
  HttpServerError,
  HttpUnauthorizedError,
} from '../../../clients/exceptions';
import { logWarningInSentry } from '../../../utils/sentry';

export default nextConnect<NextApiRequest, NextApiResponse>().get(
  async (req, res) => {
    try {
      const session = (await getSession(req, res)) as ISession;

      if (!session.passport) {
        throw new HttpServerError(500, 'Passport was not found in session');
      }

      const sirenFrom = session?.navigation?.sirenFrom;

      if (!sirenFrom) {
        logWarningInSentry('No sirenFrom found during dirigeant verification');
        return res.redirect(`/`);
      }

      const siren = verifySiren(sirenFrom);

      try {
        const user = getUser(session);
        const [uniteLegale, isDirigeant] = await Promise.all([
          getUniteLegaleFromSlug(siren).catch((e) => {
            return { siren: sirenFrom, nomComplet: 'Nom inconnu' };
          }),
          verifyDirigeant(siren, user),
        ]);

        session.passport.companies = [
          ...(session.passport.companies || []),
          {
            siren,
            denomination: uniteLegale.nomComplet,
          },
        ];

        const redirectTo = `${
          session?.navigation?.pageFrom || '/compte/'
        }/${sirenFrom}`;

        return res.redirect(redirectTo);
      } catch (verificationError) {
        if (verificationError instanceof HttpUnauthorizedError) {
          const errorWhy = verificationError.message;
          const url = `/compte/echec-habilitation/${siren}${
            errorWhy ? `?why=${errorWhy}}` : ''
          }`;

          return res.redirect(url);
        }
        throw verificationError;
      }
    } catch (e) {
      return res.redirect(`/compte/echec-connexion`);
    }
  }
);
