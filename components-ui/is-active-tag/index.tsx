import React from 'react';
import { IETATADMINSTRATIF } from '../../models/etat-administratif';
import { formatDate } from '../../utils/helpers/formatting';
import InformationTooltip from '../information-tooltip';
import { Tag } from '../tag';

const classFromState = (state: IETATADMINSTRATIF) => {
  switch (state) {
    case IETATADMINSTRATIF.ACTIF:
      return 'open';
    case IETATADMINSTRATIF.CESSEE:
    case IETATADMINSTRATIF.FERME:
      return 'closed';
    case IETATADMINSTRATIF.NONDIFF:
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
  state: IETATADMINSTRATIF;
  since?: string | null;
}> = ({ state, since }) => (
  <>
    {state === IETATADMINSTRATIF.INCONNU ||
    state === IETATADMINSTRATIF.NONDIFF ? (
      <InformationTooltip
        label="Nous n’avons pas les
            informations nécessaires pour savoir si cette entité est en activité
            ou si elle est fermée."
      >
        <EtatTag state={state} />
      </InformationTooltip>
    ) : state === IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT ? (
      <InformationTooltip label="Cette entité est active du point de vue administratif, mais n’a pas d’activité économique. Tous ses établissements sont fermés.">
        <EtatTag state={state} />
      </InformationTooltip>
    ) : (
      <EtatTag state={state} since={since || ''} />
    )}
  </>
);

export default IsActiveTag;
