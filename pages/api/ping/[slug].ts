import { NextApiRequest, NextApiResponse } from 'next';
import {
  APISlugNotFound,
  pingAPIClient,
} from '../../../clients/ping-api-clients';

const ping = async (
  { query: { slug } }: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { test, status } = await pingAPIClient(slug);
    if (test) {
      res.status(200).json({ message: 'ok' });
    } else {
      res.status(status | 500).json({ message: 'ko' });
    }
  } catch (e) {
    if (e instanceof APISlugNotFound) {
      res.status(404).json(e);
    } else {
      res.status(500).json(e);
    }
  }
};

export default ping;
