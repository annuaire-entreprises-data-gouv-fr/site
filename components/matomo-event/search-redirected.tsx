import React from 'react';
import { Siren, Siret } from '../../utils/helpers/siren-and-siret';

const MatomoEventRedirected: React.FC<{ sirenOrSiret: Siren | Siret }> = ({
  sirenOrSiret,
}) => (
  <div
    dangerouslySetInnerHTML={{
      __html: `
        <script>
          var _paq = window._paq || [];
          _paq.push([
              'trackEvent',
              'research:redirected',
              '${sirenOrSiret}',
              'redirected=${sirenOrSiret}',
          ]);
        </script>
        `,
    }}
  ></div>
);

export default MatomoEventRedirected;
