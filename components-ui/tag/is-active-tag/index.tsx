import type React from "react";
import InformationTooltip from "#components-ui/information-tooltip";
import { Tag } from "#components-ui/tag";
import {
  estNonDiffusibleStrict,
  type ISTATUTDIFFUSION,
} from "#models/core/diffusion";
import { IETATADMINSTRATIF } from "#models/core/etat-administratif";
import { formatDate } from "#utils/helpers";

const classFromState = (state: IETATADMINSTRATIF) => {
  switch (state) {
    case IETATADMINSTRATIF.ACTIF:
      return "success";
    case IETATADMINSTRATIF.CESSEE:
    case IETATADMINSTRATIF.FERME:
      return "error";
    case IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT:
    default:
      return "new";
  }
};

const EtatTag: React.FC<{
  state: IETATADMINSTRATIF;
  since?: string;
  size?: "medium" | "small";
}> = ({ state, since = "", size = "medium" }) => (
  <Tag color={classFromState(state)} size={size}>
    {state}
    {since && <>&nbsp;le&nbsp;{formatDate(since)}</>}
  </Tag>
);

const IsActiveTag: React.FC<{
  etatAdministratif: IETATADMINSTRATIF;
  statutDiffusion: ISTATUTDIFFUSION;
  since?: string | null;
  size?: "medium" | "small";
}> = ({ etatAdministratif, statutDiffusion, since, size = "medium" }) => {
  if (
    etatAdministratif === IETATADMINSTRATIF.INCONNU ||
    estNonDiffusibleStrict({ statutDiffusion })
  ) {
    return (
      <InformationTooltip
        label="Nous n’avons pas les
    informations nécessaires pour savoir si cette structure est en activité
    ou si elle est fermée."
        tabIndex={0}
      >
        <EtatTag size={size} state={IETATADMINSTRATIF.INCONNU} />
      </InformationTooltip>
    );
  }

  if (etatAdministratif === IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT) {
    return (
      <InformationTooltip
        label="Cette structure est en sommeil ou présumée inactive. Elle est active du point de vue administratif mais tous ses établissements sont fermés. Elle n’a pas d’activité économique."
        tabIndex={0}
      >
        <EtatTag size={size} state={etatAdministratif} />
      </InformationTooltip>
    );
  }

  return <EtatTag since={since || ""} size={size} state={etatAdministratif} />;
};

export default IsActiveTag;
