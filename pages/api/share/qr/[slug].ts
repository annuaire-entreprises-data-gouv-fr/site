import { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';
import { hasSirenFormat } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';

const getUrl = (slug: string) => {
  if (hasSirenFormat(slug)) {
    return `https://annuaire-entreprises.data.gouv.fr/entreprise/${slug}?mtm_campaign=qr-code`;
  }
  return `https://annuaire-entreprises.data.gouv.fr/etablissement/${slug}?mtm_campaign=qr-code`;
};

const qrCode = ({ query: { slug } }: NextApiRequest, res: NextApiResponse) => {
  const url = getUrl(slug as string);

  // next js warning caused by callback => https://github.com/vercel/next.js/issues/10439
  return new Promise((resolve) => {
    try {
      QRCode.toDataURL(
        url,
        {
          margin: 1,
          color: {
            dark: '#000',
            light: '#fff',
          },
        },
        function (err, url) {
          const base64Data = url.replace(/^data:image\/png;base64,/, '');
          var img = Buffer.from(base64Data, 'base64');

          res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length,
          });
          res.end(img);
          resolve(null);
        }
      );
    } catch (e: any) {
      logErrorInSentry(e, { siren: slug as string });
      res.status(500).json({ message: e });
      resolve(null);
    }
  });
};

export default qrCode;
