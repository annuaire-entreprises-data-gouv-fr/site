import { NextApiRequest, NextApiResponse } from 'next';
import { redirect } from 'next/dist/next-server/server/api-utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { siren, format },
  } = req;

  const RNM_LINK = `https://api-rnm.artisanat.fr/v2/entreprises/${siren}`;
  const RNCS_LINK = `https://data.inpi.fr/entreprises/${siren}`;
  const RNCS_PRINT = `https://data.inpi.fr/print/companies/${siren}`;

  const rnm = await fetch(RNM_LINK + '?format=html');
  if (rnm.status === 200) {
    redirect(res,  RNM_LINK + `?format=${format || 'html'}`);
  }

  // so instead of calling data.inpi.fr page we rather call the print page that is much faster
  const rncs_test = await fetch(RNCS_PRINT);

  if (rncs_test.status === 200) {
    redirect(res,  RNCS_LINK + (format ? `?format=${format}` : ''));
  }

  try {
    redirect(res,  `/introuvable/immatriculation?q=${siren}`);
  } catch (err) {
    res.statusCode = 500;
    res.send({ Error: err });
  }
}
