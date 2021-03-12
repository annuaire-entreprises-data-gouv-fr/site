import type { NextApiRequest, NextApiResponse } from 'next';

import { getAvisSituationSiren } from '../../clients/sirene-insee/avis-situation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const r = await getAvisSituationSiren('', '');

  const keys = r.headers.keys();
  let header = keys.next();
  while (header.value) {
    res.setHeader(header.value, r.headers.get(header.value));
    header = keys.next();
  }

  res.status(200).send(await r.text());
}
