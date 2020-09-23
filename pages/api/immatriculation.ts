import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { siren, format },
  } = req;

  const RNM_LINK = `https://api-rnm.artisanat.fr/v2/entreprises/${siren}`;
  const RNCS_LINK = `https://data.inpi.fr/entreprises/${siren}`;

  const rnm = await fetch(RNM_LINK + '?format=html');
  if (rnm.status === 200) {
    res.writeHead(302, {
      Location: RNM_LINK + `?format=${format || 'html'}`,
    });
    res.end();
  }

  const rncs = await fetch(RNCS_LINK);
  if (rncs.status === 200) {
    res.writeHead(302, {
      Location: RNCS_LINK + (format ? `?format=${format}` : ''),
    });
    res.end();
  }
  console.log(rnm.status);

  //   https://data.inpi.fr/entreprises/:siren
  // https://data.inpi.fr/entreprises/:siren?format=pdf
  // https://api-rnm.artisanat.fr/v2/entreprises/:siren?format=html
  // https://api-rnm.artisanat.fr/v2/entreprises/:siren?format=pdf

  try {
    res.json({ test: 'test' });
  } catch (err) {
    res.statusCode = 500;
    res.send({ Error: err });
  }
}
