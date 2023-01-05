import React from 'react';
import { render } from 'react-dom';
import InformationTooltip from '#components-ui/information-tooltip';
import { Tag } from '#components-ui/tag';
import { IETATADMINSTRATIF } from '#models/etat-administratif';
import { ISTATUTDIFFUSION } from '#models/statut-diffusion';
import { formatDate } from '#utils/helpers';

const classFromState = (state: IETATADMINSTRATIF) => {
  switch (state) {
    case IETATADMINSTRATIF.ACTIF:
      return 'open';
    case IETATADMINSTRATIF.CESSEE:
    case IETATADMINSTRATIF.FERME:
      return 'closed';
    case IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT:
    default:
      return 'unknown';
  }
};

const EtatTag: React.FC<{
  state: IETATADMINSTRATIF;
  since?: string;
}> = ({ state, since = '' }) => (
  <Tag className={classFromState(state)}>
    {state}
    {since && <>&nbsp;le&nbsp;{formatDate(since)}</>}
  </Tag>
);

const IsActiveTag: React.FC<{
  etatAdministratif: IETATADMINSTRATIF;
  statutDiffusion: ISTATUTDIFFUSION;
  since?: string | null;
}> = ({ etatAdministratif, statutDiffusion, since }) => {
  if (
    etatAdministratif === IETATADMINSTRATIF.INCONNU ||
    statutDiffusion === ISTATUTDIFFUSION.NONDIFF
  ) {
    return (
      <InformationTooltip
        label="Nous n’avons pas les
    informations nécessaires pour savoir si cette structure est en activité
    ou si elle est fermée."
      >
        <EtatTag state={IETATADMINSTRATIF.INCONNU} />
      </InformationTooltip>
    );
  }

  if (etatAdministratif === IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT) {
    return (
      <InformationTooltip label="Cette structure est active du point de vue administratif, mais n’a pas d’activité économique. Tous ses établissements sont fermés.">
        <EtatTag state={etatAdministratif} />
      </InformationTooltip>
    );
  }

  return <EtatTag state={etatAdministratif} since={since || ''} />;
};

export default IsActiveTag;
