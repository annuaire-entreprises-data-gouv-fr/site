import type { NextApiRequest, NextApiResponse } from 'next';

import { getAvisSituationSiren } from '../../clients/sirene-insee/avis-situation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const keys = req.headers.keys();
  let header = keys.next();
  while (header.value) {
    //@ts-ignore
    res.setHeader(header.value, r.headers.get(header.value));
    header = keys.next();
  }
  
  const r = await getAvisSituationSiren('', '');


  res.status(200).send(await r.text());
}
