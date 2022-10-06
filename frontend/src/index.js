import './helpers-copy-paste';
import './helpers-feedbacks';
import './async-client-update';
import './inpi-pdf-download';
import './load-bar';
import './advanced-search';

import './sentry';

// include DSFR in bundle in prod
if (import.meta.env.PROD) {
  import('../style/dsfr.min.css');
  import('../style/globals.css');
}
