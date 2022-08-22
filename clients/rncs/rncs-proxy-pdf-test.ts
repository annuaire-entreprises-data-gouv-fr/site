import { Siren } from '../../utils/helpers/siren-and-siret';
import { httpGet } from '../../utils/network';
import { logWarningInSentry } from '../../utils/sentry';

const sleep = async (seconds: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve, seconds * 1000);
  });
};

const downloadAuthenticatedPdf = async (siren: Siren) => {
  let retry = 0;
  const create = await httpGet(
    `https://staging.rncs-proxy.api.gouv.fr/document/justificatif/job/${siren}`,
    {
      timeout: 90 * 1000,
      headers: {
        'X-APIKey': process.env.PROXY_API_KEY || '',
      },
    }
  );
  const slug = create.data.slug;

  if (!slug) {
    throw new Error('PDF test: job was not created properly');
  }

  while (retry <= 3) {
    await sleep(15);
    try {
      const file = await httpGet(
        `https://staging.rncs-proxy.api.gouv.fr/downloads/${slug}.pdf`,
        {
          headers: {
            'X-APIkey': process.env.PROXY_API_KEY || '',
          },
        }
      );
      return file;
    } catch {}
    retry += 1;
  }
  throw new Error('PDF test: Authenticated PDF failed');
};

export const checkINPIpdfProxy = async (siren: Siren) => {
  try {
    // let's download the regular pdf
    const [unauthentifiedPdf, authentifiedPdf] = await Promise.all([
      httpGet(
        `https://data.inpi.fr/export/companies?format=pdf&ids=["${siren}"]`,
        {
          timeout: 90 * 1000,
          headers: {
            Accept: '*/*',
            Host: 'data.inpi.fr',
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:100.0) Gecko/20100101 Firefox/100.0',
          },
        }
      ),
      // and the authenticated one
      downloadAuthenticatedPdf(siren),
    ]);

    // we compare size
    const unauthentifiedPdfSize = unauthentifiedPdf.data.length;
    const authentifiedPdfSize = authentifiedPdf.data.length;
    const ratio = unauthentifiedPdfSize / authentifiedPdfSize;

    // pdf should be bigger than 100ko
    if (unauthentifiedPdfSize <= 100000) {
      throw new Error('PDF test: unauthentified PDF too small');
    }

    if (authentifiedPdfSize <= 100000) {
      throw new Error('PDF test: authentified PDF too small');
    }

    if (
      unauthentifiedPdfSize === authentifiedPdfSize ||
      ratio < 0.5 ||
      ratio > 2
    ) {
      throw new Error(
        `PDF test: size ratio is suspect. unauthenticated PDF is ${
          ratio * 100
        }% of authenticated (${authentifiedPdfSize})`
      );
    }
  } catch (error: any) {
    logWarningInSentry('PDF test failed', { details: error.toString() });
    throw error;
  }
};
