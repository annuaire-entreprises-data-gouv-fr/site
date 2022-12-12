import React from 'react';
import { Siren, Siret } from '#utils/helpers';
import MatomoEvent from '.';

const MatomoEventFromSearch: React.FC<{ sirenOrSiret: Siren | Siret }> = ({
  sirenOrSiret,
}) => (
  <MatomoEvent
    category="research:redirected"
    action={sirenOrSiret}
    name={`redirected=${sirenOrSiret}`}
  />
);

export default MatomoEventFromSearch;
