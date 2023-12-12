import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  clientDownloadActe,
  clientDownloadBilan,
} from '#clients/api-proxy/rne/documents';
import { HttpBadRequestError, HttpForbiddenError } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { isAgent, sessionOptions } from '#utils/session';

export default withIronSessionApiRoute(download, sessionOptions);

async function download(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, type },
    session,
  } = req;

  try {
    if (!isAgent(session)) {
      throw new HttpForbiddenError('Unauthorized account');
    }

    if (!slug) {
      throw new HttpBadRequestError('Please provide a valid acte id');
    }

    let pdf = '';
    if (type === 'bilan') {
      pdf = await clientDownloadBilan(slug as string);
    } else if (type === 'acte') {
      pdf = await clientDownloadActe(slug as string);
    } else {
      throw new HttpBadRequestError('Please provide a valid document type');
    }

    res.status(200);
    res.setHeader('content-type', 'application/pdf');
    res.end(Buffer.from(pdf, 'binary'));
  } catch (e: any) {
    const message = 'Failed to download document';
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'RNEDocuments',
        message,
        administration: EAdministration.INPI,
        context: { details: slug as string },
      })
    );
    res.status(e.status || 500).json({ message });
  }
}
