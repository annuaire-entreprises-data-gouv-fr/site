import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../utils/session';

export default nextConnect<NextApiRequest, NextApiResponse>().get(
  async (req, res) => {
    const session = await getSession(req, res); // session is set to req.session

    const sirenFrom = session.navigation.sirenFrom;

    if (session.navigation && sirenFrom) {
      // call API dirigeant with siren

      session.passport.companies = [
        ...(session.passport.companies || []),
        { siren: sirenFrom },
      ];

      const redirectTo = `${
        session.navigation.pageFrom || '/compte/'
      }/${sirenFrom}`;

      return res.redirect(redirectTo);
    } else {
      return res.redirect(`/`);
    }
  }
);
