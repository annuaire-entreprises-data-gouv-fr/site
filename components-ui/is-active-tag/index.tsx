import React from 'react';
import { IETATADMINSTRATIF } from '../../models/etat-administratif';
import InformationTooltip from '../information-tooltip';
import { Tag } from '../tag';

const etatClass = (etat: IETATADMINSTRATIF) => {
  switch (etat) {
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
  etat: IETATADMINSTRATIF;
}> = ({ etat }) => <Tag className={etatClass(etat)}>{etat}</Tag>;

const IsActiveTag: React.FC<{
  etat: IETATADMINSTRATIF;
}> = ({ etat }) => (
  <>
    {etat === IETATADMINSTRATIF.INCONNU ||
    etat === IETATADMINSTRATIF.NONDIFF ? (
      <InformationTooltip
        label="Nous n’avons pas les
            informations nécessaires pour savoir si cette entité est en activité
            ou si elle est fermée."
      >
        <EtatTag etat={etat} />
      </InformationTooltip>
    ) : etat === IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT ? (
      <InformationTooltip label="Cette entité est active selon l’Insee, mais tous ses établissements sont fermés. Elle est donc en sommeil.">
        <EtatTag etat={etat} />
      </InformationTooltip>
    ) : (
      <EtatTag etat={etat} />
    )}
  </>
);

export default IsActiveTag;
