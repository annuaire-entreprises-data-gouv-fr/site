import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../utils/session';

export default nextConnect<NextApiRequest, NextApiResponse>().get(
  async (req, res) => {
    const session = await getSession(req, res); // session is set to req.session

    // call API dirigeant
    if (session.navigation && session.navigation.origin) {
      return res.redirect(`/compte/${session.navigation.origin}`);
    } else {
      return res.redirect(`/`);
    }
  }
);
