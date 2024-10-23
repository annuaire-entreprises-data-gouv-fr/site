import {
  clientDownloadActe,
  clientDownloadBilan,
} from '#clients/api-proxy/rne/documents';
import { HttpBadRequestError, HttpForbiddenError } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
import { ApplicationRights, hasRights } from '#models/user/rights';
import logErrorInSentry from '#utils/sentry';
import withSessionPagesRouter from '#utils/session/with-session-pages-router';

// This can't be migrated to App Router
// because responseLimit: false is not supported
//
// https://github.com/vercel/next.js/issues/57501
// https://github.com/vercel/next.js/issues/55589
//
//
export default withSessionPagesRouter(async function download(req, res) {
  const {
    query: { slug, type },
    session,
  } = req;

  try {
    if (!hasRights(session, ApplicationRights.documentsRne)) {
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
});

// Actes can often be bigger than 4MB
// https://nextjs.org/docs/messages/api-routes-response-size-limit#possible-ways-to-fix-it
export const config = {
  api: {
    responseLimit: false,
  },
};
