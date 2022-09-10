import { NextApiRequest, NextApiResponse } from 'next';
import { tvaIntracommunautaire } from '../../../models/tva';

const verify = async (
  { query: { slug } }: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const tva = await tvaIntracommunautaire(slug as string);
    res.status(200).json({ tva });
  } catch (e: any) {
    res
      .status(e.status || 500)
      .json({ message: 'failed to verify TVA number' });
  }
};

export default verify;
