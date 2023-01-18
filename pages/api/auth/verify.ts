import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import {
  HttpServerError,
  HttpUnauthorizedError,
} from '../../../clients/exceptions';
import { verifySiren } from '../../../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../../../utils/sentry';
import { sessionOptions } from '../../../utils/session';
import { getUser } from '../../../utils/session/accessSession';

export default withIronSessionApiRoute(
  nextConnect<NextApiRequest, NextApiResponse>().get(
    async (req, res, session) => {
      try {
        console.log(req, res, session);

        if (!session.passport) {
          throw new HttpServerError('Passport was not found in session');
        }

        const sirenFrom = session?.navigation?.sirenFrom;

        if (!sirenFrom) {
          logWarningInSentry(
            'No sirenFrom found during dirigeant verification'
          );
          return res.redirect(`/`);
        }

        const siren = verifySiren(sirenFrom);

        try {
          const user = getUser(session);

          // here should verify hashed email in hardcoded list

          session.passport.companies = [...(session.passport.companies || [])];

          const redirectTo = `/${
            session?.navigation?.pageFrom || 'compte'
          }/${sirenFrom}`;

          return res.redirect(redirectTo);
        } catch (verificationError) {
          if (verificationError instanceof HttpUnauthorizedError) {
            const errorWhy = verificationError.message;
            const url = `/connexion/echec-habilitation/${siren}${
              errorWhy ? `?why=${errorWhy}` : ''
            }`;

            return res.redirect(url);
          }
          throw verificationError;
        }
      } catch (e) {
        return res.redirect(`/connexion/echec-connexion`);
      }
    }
  ),
  sessionOptions
);
