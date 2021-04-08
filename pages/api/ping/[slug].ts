import { NextApiRequest, NextApiResponse } from 'next';
import { HttpNotFound } from '../../../clients/exceptions';
import { testApi } from '../../../clients/test';

const ping = async (
  { query: { slug } }: NextApiRequest,
  res: NextApiResponse
) => {
  if (slug) {
    try {
      await testApi(slug);
      res.status(200).json({ message: 'ok' });
    } catch (e) {
      if (e instanceof HttpNotFound) {
        res.status(404).json({ message: e });
      } else {
        res.status(500).json({ message: 'ko' });
      }
    }
  } else {
    res.status(404).json({ message: `Slug: ${slug} not found.` });
  }
};

export default ping;
