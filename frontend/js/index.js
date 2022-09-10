import './helpers-copy-paste';
import './helpers-feedbacks';
import './async-client-update';
import './inpi-pdf-download';

import './sentry';

// include DSFR in bundle in prod
if (import.meta.env.PROD) {
  import('../css/dsfr.min.css');
  import('../css/globals.css');
}
