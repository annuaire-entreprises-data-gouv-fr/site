import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { client } from '../../../../clients/france-connect/strategy';
import { getSession } from '../../../../utils/session';

export default nextConnect<NextApiRequest, NextApiResponse>().get(
  async (req, res, next) => {
    const session = await getSession(req, res);
    res.redirect(
      client.endSessionUrl({ id_token_hint: session?.passport?.user?.id_token })
    );
  }
);
