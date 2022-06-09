const axios = require('axios');

require('dotenv').config();

console.info('=== INPI PDF proxy checker ===');

const sleep = async (seconds) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), seconds * 1000);
  });
};

const downloadAuthenticatedPdf = async (siren) => {
  let retry = 0;
  const create = await axios(
    `https://staging.rncs-proxy.api.gouv.fr/document/justificatif/job/${siren}`,
    {
      timeout: 90 * 1000,
      method: 'GET',
      headers: {
        'X-APIKey': process.env.PROXY_API_KEY,
      },
    }
  );
  const slug = create.data.slug;

  if (!slug) {
    throw new Error('Job was not created properly');
  }

  console.log(slug);

  while (retry <= 3) {
    await sleep(15);
    try {
      const file = await axios(
        `https://staging.rncs-proxy.api.gouv.fr/downloads/${slug}.pdf`,
        {
          headers: {
            'X-APIkey': process.env.PROXY_API_KEY,
          },
        }
      );
      return file;
    } catch (e) {
      console.log(`Attempt n°${retry} failed. Retrying in 15 seconds...`);
    }
    retry += 1;
  }
};

const checkINPIpdfProxy = async () => {
  try {
    // let's test Danone Siren
    const siren = '552032534';

    // let's download the regular pdf
    const [unauthentifiedPdf, authentifiedPdf] = await Promise.all([
      axios(`https://data.inpi.fr/entreprises/${siren}?format=pdf`, {
        timeout: 90 * 1000,
        method: 'GET',
      }),
      // and the authenticated one
      downloadAuthenticatedPdf(siren),
    ]);

    // we compare size
    const unauthentifiedPdfSize = unauthentifiedPdf.data.length;
    const authentifiedPdfSize = authentifiedPdf.data.length;
    const ratio = unauthentifiedPdfSize / authentifiedPdfSize;

    // pdf should be bigger than one mo
    if (unauthentifiedPdfSize <= 1000000 || authentifiedPdfSize <= 1000000) {
      console.info(
        '=> ❌ at least one PDF is too small and might be corrupted'
      );
      process.exit(1);
    }

    if (ratio <= 0.55 || ratio >= 0.85) {
      console.info(
        `=> ❌ size ratio is suspect. unauthenticated PDF is ${
          ratio * 100
        }% of authenticated (${authentifiedPdfSize})`
      );
      process.exit(1);
    }
    console.info('=> ✅ yaaay ! pdf proxy worked like a charm 🧙‍♂️');
  } catch (e) {
    console.log(e);
    console.info('=> ❌ download failed');
    process.exit(1);
  }
};
checkINPIpdfProxy();
