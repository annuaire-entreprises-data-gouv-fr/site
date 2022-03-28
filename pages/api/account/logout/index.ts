import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { client } from '../../../../clients/france-connect/strategy';

export default nextConnect<NextApiRequest, NextApiResponse>().get(
  async (req, res, next) => {
    res.redirect(client.endSessionUrl());
  }
);
