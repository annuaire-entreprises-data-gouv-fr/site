import { NextApiRequest, NextApiResponse } from 'next';
import { APISlugNotFound, pingAPIClient } from '#clients/ping-api-clients';

const ping = async (
  { query: { slug } }: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { test, status = 500 } = await pingAPIClient(slug || '');

    if (test) {
      res.status(200).json({ message: 'ok' });
    } else {
      res.status(500).json({ message: 'ko', status });
    }
  } catch (e: any) {
    if (e instanceof APISlugNotFound) {
      res.status(404).json(e);
    } else {
      res.status(500).json(e);
    }
  }
};

export default ping;
