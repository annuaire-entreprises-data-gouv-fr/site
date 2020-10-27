import { NextApiRequest, NextApiResponse } from 'next';
import redirect from '../../utils/redirect';

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
    redirect(res, RNM_LINK + `?format=${format || 'html'}`);
  }

  const rncs = await fetch(RNCS_LINK);

  if (rncs.status === 200) {
    redirect(res, RNCS_LINK + (format ? `?format=${format}` : ''));
  }

  try {
    redirect(res, `/introuvable/immatriculation?q=${siren}`);

  } catch (err) {
    res.statusCode = 500;
    res.send({ Error: err });
  }
}
