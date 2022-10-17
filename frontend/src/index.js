import './helpers-copy-paste';
import './helpers-feedbacks';
import './async-client-update';
import './inpi-pdf-download';
import './load-bar';

import './sentry';

// include DSFR in bundle in prod
if (import.meta.env.PROD) {
  // prefetch <a>
  import('./instant-page.js');

  import('../style/dsfr.min.css');
  import('../style/globals.css');
}
