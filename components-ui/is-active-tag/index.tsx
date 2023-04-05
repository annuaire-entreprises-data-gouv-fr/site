import React from 'react';
import InformationTooltip from '#components-ui/information-tooltip';
import { Tag } from '#components-ui/tag';
import { IETATADMINSTRATIF } from '#models/etat-administratif';
import { ISTATUTDIFFUSION } from '#models/statut-diffusion';
import { formatDate } from '#utils/helpers';

const classFromState = (state: IETATADMINSTRATIF) => {
  switch (state) {
    case IETATADMINSTRATIF.ACTIF:
      return 'success';
    case IETATADMINSTRATIF.CESSEE:
    case IETATADMINSTRATIF.FERME:
      return 'error';
    case IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT:
    default:
      return 'new';
  }
};

const EtatTag: React.FC<{
  state: IETATADMINSTRATIF;
  since?: string;
}> = ({ state, since = '' }) => (
  <Tag color={classFromState(state)}>
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
      <InformationTooltip label="Cette structure est en sommeil ou présumée inactive. Elle est active du point de vue administratif mais tous ses établissements sont fermés. Elle n’a pas d’activité économique.">
        <EtatTag state={etatAdministratif} />
      </InformationTooltip>
    );
  }

  return <EtatTag state={etatAdministratif} since={since || ''} />;
};

export default IsActiveTag;
