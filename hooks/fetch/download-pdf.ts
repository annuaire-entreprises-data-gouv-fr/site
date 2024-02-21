import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function usePDFDownloader(pdfLink: string) {
  return useFetchData(
    {
      fetchData: async () => {
        try {
          const t = httpGet<Blob>(pdfLink, { responseType: 'blob' });
          return t;
        } catch (e) {
          console.log(e);
          throw new HttpNotFound('Siren non existant');
        }
      },
      administration: EAdministration.INPI,
      logError: (e: any) => {
        const message = true ? 'Not found - 404' : 'Failed and redirected';

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
