import './sentry';

// load first to lowser CLS
import './helpers-feedbacks';

import './favourites';
import './fetch-tva';
import './helpers-copy-paste';
import './inpi-pdf-download';
import './load-bar';

// include DSFR in bundle in prod
if (import.meta.env.PROD) {
  import('../style/dsfr.min.css');
  import('../style/globals.css');
}
