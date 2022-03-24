import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { client } from '../../../../clients/france-connect/strategy';

export default nextConnect<NextApiRequest, NextApiResponse>().get(
  async (req, res, next) => {
    console.log(client.endSessionUrl({ state, id_token_hint }));
    res.redirect(client.endSessionUrl());
  }
);
