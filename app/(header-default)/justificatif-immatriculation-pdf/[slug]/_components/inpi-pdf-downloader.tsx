'use client';

import routes from '#clients/routes';
import { Tag } from '#components-ui/tag';
import { EAdministration } from '#models/administrations/EAdministration';
import { isAPI404, isAPINotResponding } from '#models/api-not-responding';
import { isDataLoading } from '#models/data-fetching';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import usePDFDownloader from 'hooks/fetch/download-pdf';
import { PDFFailed } from './pdf-failed';
import { PDFFLoading } from './pdf-loading';
import { PDFNotFound } from './pdf-not-found';

function saveAsPdf(blob: Blob, siren: string) {
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  //@ts-ignore
  a.style = 'display: none';
  a.href = url;
  a.download = 'extrait_immatriculation_inpi_' + siren + '.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export function InpiPDFDownloader({ siren }: { siren: string }) {
  const downloadLink = `${routes.rne.portail.pdf}?format=pdf&ids=[%22${siren}%22]`;

  const pdf = usePDFDownloader(downloadLink);

  if (isDataLoading(pdf)) {
    return <PDFFLoading />;
  }

  if (isAPI404(pdf)) {
    return <PDFNotFound downloadLink={downloadLink} />;
  }

  if (isAPINotResponding(pdf)) {
    return <PDFFailed downloadLink={downloadLink} />;
  }
  try {
    saveAsPdf(pdf, siren);
  } catch (e) {
    logErrorInSentry(
      new FetchRessourceException({
        ressource: 'PDFDownloadException',
        message: 'Failed to save blob as PDF',
        administration: EAdministration.INPI,
        cause: e,
      })
    );

    return <PDFFailed downloadLink={downloadLink} />;
  }

  return (
    <>
      <Tag color="success">succès</Tag>
    </>
  );
}
