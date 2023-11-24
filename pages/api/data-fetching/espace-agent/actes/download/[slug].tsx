import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { clientDownloadActe } from '#clients/api-proxy/rne/actes';
import { HttpBadRequestError, HttpForbiddenError } from '#clients/exceptions';
import logErrorInSentry from '#utils/sentry';
import { isAgent, sessionOptions } from '#utils/session';

export default withIronSessionApiRoute(downloadActe, sessionOptions);

async function downloadActe(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug },
    session,
  } = req;

  try {
    if (!isAgent(session)) {
      throw new HttpForbiddenError('Unauthorized account');
    }

    if (!slug) {
      throw new HttpBadRequestError('Please provide a valid acte id');
    }

    const pdf = await clientDownloadActe(slug as string);
    res.status(200);
    res.setHeader('content-type', 'application/pdf');
    res.end(Buffer.from(pdf, 'binary'));
  } catch (e: any) {
    const message = 'Failed to download acte';
    logErrorInSentry(e, { details: slug as string, errorName: message });
    res.status(e.status || 500).json({ message });
  }
}
