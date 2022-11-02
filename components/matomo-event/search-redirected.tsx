import React from 'react';
import MatomoEvent from '.';
import { Siren, Siret } from '../../utils/helpers/siren-and-siret';

const MatomoEventFromSearch: React.FC<{ sirenOrSiret: Siren | Siret }> = ({
  sirenOrSiret,
}) => (
  <MatomoEvent
    category="research:click"
    action={sirenOrSiret}
    name={`redirected=${sirenOrSiret}`}
  />
);

export default MatomoEventFromSearch;
