const axios = require('axios');

console.info('=== INPI PDF proxy checker ===');

const checkINPIpdfProxy = async () => {
  // let's test Danone Siren
  const siren = '552032534';

  // let's download the regular pdf
  const [unauthentifiedPdf, authentifiedPdf] = await Promise.all([
    axios.get(`https://data.inpi.fr/entreprises/${siren}?format=pdf`),
    // and the authenticated one
    axios.get(`http://localhost:3000/api/inpi-pdf-proxy/${siren}`),
  ]);

  // we compare size
  const unauthentifiedPdfSize = unauthentifiedPdf.data.length;
  const authentifiedPdfSize = authentifiedPdf.data.length;
  const ratio = unauthentifiedPdfSize / authentifiedPdfSize;

  // pdf should be bigger than one mo
  if (unauthentifiedPdfSize <= 1000000 || authentifiedPdfSize <= 1000000) {
    console.info('=> ❌ at least one PDF is too small and might be corrupted');
    process.exit(1);
  }

  // pdf should be bigger than one mo
  if (ratio <= 0.75 || ratio >= 0.85) {
    console.info(
      `=> ❌ size ratio is suspect. unauthenticated PDF is ${
        ratio * 100
      }% of authenticated (${authentifiedPdfSize})`
    );
    process.exit(1);
  }
  console.info('=> ✅ yaaay ! pdf proxy worked like a charm 🧙‍♂️');
};

checkINPIpdfProxy();
