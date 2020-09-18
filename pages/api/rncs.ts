import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { slug },
  } = req;

  try {
    res.json({ test: 'test' });
  } catch (err) {
    res.statusCode = 500;
    res.send({ Error: err });
  }
}
