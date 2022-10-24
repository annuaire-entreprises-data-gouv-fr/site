// load first to lowser CLS
import './helpers-feedbacks';
import './advanced-search';

import './helpers-copy-paste';
import './async-client-update';
import './inpi-pdf-download';
import './load-bar';

import './sentry';

// include DSFR in bundle in prod
if (import.meta.env.PROD) {
  import('../style/dsfr.min.css');
  import('../style/globals.css');
}
