import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchExternalData } from './use-fetch-data';

const isPdfNotFound = (msg: string) => msg.indexOf('Siren non existant') === 0;

export function usePDFDownloader(pdfLink: string) {
  return useFetchExternalData(
    {
      fetchData: async () => {
        try {
          return await httpGet<Blob>(pdfLink, { responseType: 'blob' });
        } catch (e: any) {
          if (isPdfNotFound(e?.message)) {
            throw new HttpNotFound('Not heyhey found - 404');
          }
          throw e;
        }
      },
      administration: EAdministration.INPI,
      logError: (e: any) => {
        const message = e.status === 404 ? e.message : 'Failed and redirected';

        logErrorInSentry(
          new FetchRessourceException({
            ressource: 'PDFDownloadException',
            message,
            administration: EAdministration.INPI,
            cause: e,
          })
        );
      },
    },
    [pdfLink]
  );
}

export default usePDFDownloader;
