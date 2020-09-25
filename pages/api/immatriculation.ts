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

  try {
    res.statusCode = 404;
    res.json({
      test:
        'Ce siren n’a pas été trouvé dans la base de données des greffes de tribunaux de commerce (INPI), ni dans celle des Chambres des Métiers et de l’Artisanat (CMA)',
    });
  } catch (err) {
    res.statusCode = 500;
    res.send({ Error: err });
  }
}
