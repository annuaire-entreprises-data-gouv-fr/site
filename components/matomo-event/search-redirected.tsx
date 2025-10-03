import type React from "react";
import type { Siren, Siret } from "#utils/helpers";
import MatomoEvent from ".";

const MatomoEventFromRedirected: React.FC<{ sirenOrSiret: Siren | Siret }> = ({
  sirenOrSiret,
}) => (
  <MatomoEvent
    category="research:redirected"
    action={sirenOrSiret}
    name={`redirected=${sirenOrSiret}`}
  />
);

export default MatomoEventFromRedirected;
