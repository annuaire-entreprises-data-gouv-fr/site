import routes from '../../../clients/routes';
import axios from 'axios';

console.info('=== INPI PDF proxy checker ===');

// let's test Danone Siren
const siren = '552032534';

// let's download the regular pdf
const unauthentifiedPdf = await axios.get(
  `${routes.rncs.portail.entreprise}${siren}?format=pdf`
);

// and the authenticated one
const authentifiedPdf = await axios.get(
  `http://localhost:3000/api/inpi-pdf-proxy/${siren}`
);

// we compare size
const unauthentifiedPdfSize = unauthentifiedPdf.data.length;
const authentifiedPdfSize = authentifiedPdf.data.length;
const ratio = size / size2;

// pdf should be bigger than one mo
if (unauthentifiedPdfSize <= 1000000 || authentifiedPdfSize <= 1000000) {
  console.info('=> ❌ at least one PDF is too small and might be corrupted');
  process.exit(1);
}

// pdf should be bigger than one mo
if (ratio <= 0.65 || ratio >= 0.75) {
  console.info(
    '=> ❌ size ratio is suspect. The authentication might have failed'
  );
  process.exit(1);
}
